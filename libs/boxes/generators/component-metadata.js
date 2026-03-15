import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIB_ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.join(LIB_ROOT, 'src');
const TSCONFIG_PATH = path.join(LIB_ROOT, 'tsconfig.lib.json');
const EXCLUDED_SUFFIXES = ['.spec.ts', '.stories.ts', '.test.ts'];
const EXCLUDED_METHOD_NAMES = new Set([
  'adoptedCallback',
  'attributeChangedCallback',
  'connectedCallback',
  'createRenderRoot',
  'disconnectedCallback',
  'firstUpdated',
  'render',
  'shouldUpdate',
  'update',
  'updated',
  'willUpdate',
]);
const TYPE_FORMAT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.MultilineObjectLiterals |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

export async function collectComponentMetadata() {
  const componentEntries = await discoverComponentEntries();
  const program = createProgram();
  const checker = program.getTypeChecker();
  const components = [];

  for (const entry of componentEntries) {
    const sourceFile = program.getSourceFile(entry.sourcePath);
    if (!sourceFile) {
      continue;
    }

    const tagConstants = extractTagConstants(sourceFile);
    const fileComponents = extractComponents({
      checker,
      entryName: entry.entryName,
      sourceFile,
      sourcePath: entry.sourcePath,
      tagConstants,
    });

    components.push(...fileComponents);
  }

  components.sort((left, right) => left.tagName.localeCompare(right.tagName));

  return {
    components,
  };
}

async function discoverComponentEntries() {
  const directories = await fs.readdir(SRC_ROOT, { withFileTypes: true });
  const entries = [];

  for (const entry of directories) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directoryPath = path.join(SRC_ROOT, entry.name);
    const files = await fs.readdir(directoryPath, { withFileTypes: true });
    const componentFile = files.find(
      (file) =>
        file.isFile() &&
        file.name.endsWith('.ts') &&
        file.name !== 'index.ts' &&
        !EXCLUDED_SUFFIXES.some((suffix) => file.name.endsWith(suffix)),
    );

    if (!componentFile || !files.some((file) => file.isFile() && file.name === 'index.ts')) {
      continue;
    }

    entries.push({
      entryName: entry.name,
      sourcePath: path.join(directoryPath, componentFile.name),
    });
  }

  entries.sort((left, right) => left.entryName.localeCompare(right.entryName));

  return entries;
}

function createProgram() {
  const configFile = ts.readConfigFile(TSCONFIG_PATH, ts.sys.readFile);

  if (configFile.error) {
    const message = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      '\n',
    );
    throw new Error(`Unable to read tsconfig: ${message}`);
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(TSCONFIG_PATH),
  );

  return ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  });
}

function extractComponents({
  checker,
  entryName,
  sourceFile,
  sourcePath,
  tagConstants,
}) {
  const components = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isClassDeclaration(statement) || !statement.name) {
      continue;
    }

    const tagName = resolveCustomElementTag(statement, tagConstants, sourceFile);
    if (!tagName) {
      continue;
    }

    const members = extractMembers(statement, checker, sourceFile);
    const attributes = extractAttributes(statement, checker, sourceFile);
    const events = extractEvents(statement, checker);

    components.push({
      attributes,
      className: statement.name.text,
      entryName,
      events,
      importPath: `../${entryName}`,
      members,
      modulePath: `${entryName}.js`,
      reactProperties: extractReactProperties(attributes, members),
      sourcePath: toPosixPath(path.relative(LIB_ROOT, sourcePath)),
      superclassName: resolveSuperclassName(statement, sourceFile),
      tagName,
    });
  }

  return components;
}

function extractAttributes(declaration, checker, sourceFile) {
  const attributes = [];

  for (const member of declaration.members) {
    if (!ts.isPropertyDeclaration(member) || isNonPublicInstanceMember(member)) {
      continue;
    }

    const propertyDecorator = readDecorators(member).find((decorator) =>
      isDecoratorNamed(decorator, 'property', sourceFile),
    );

    if (!propertyDecorator) {
      continue;
    }

    const propertyName = getPropertyName(member.name, sourceFile);
    if (!propertyName) {
      continue;
    }

    const attributeName = getAttributeName(propertyDecorator, propertyName, sourceFile);
    if (!attributeName) {
      continue;
    }

    attributes.push({
      name: attributeName,
      propertyName,
      typeText: getTypeTextForNode(member, checker, sourceFile),
    });
  }

  return dedupeByName(attributes);
}

function extractMembers(declaration, checker, sourceFile) {
  const fields = [];
  const methods = [];
  const accessors = new Map();

  for (const member of declaration.members) {
    if (isNonPublicInstanceMember(member)) {
      continue;
    }

    if (ts.isPropertyDeclaration(member)) {
      const name = getPropertyName(member.name, sourceFile);
      if (!name) {
        continue;
      }

      fields.push({
        kind: 'field',
        name,
        readonly: hasModifier(member, ts.SyntaxKind.ReadonlyKeyword),
        typeText: getTypeTextForNode(member, checker, sourceFile),
      });
      continue;
    }

    if (ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
      const name = getPropertyName(member.name, sourceFile);
      if (!name) {
        continue;
      }

      const current = accessors.get(name) ?? {
        kind: 'field',
        name,
        readonly: true,
        typeText: undefined,
      };

      if (ts.isGetAccessorDeclaration(member)) {
        const signature = checker.getSignatureFromDeclaration(member);
        const returnType = signature
          ? checker.getReturnTypeOfSignature(signature)
          : checker.getTypeAtLocation(member);

        current.typeText = typeToString(checker, returnType, member);
      } else {
        const [parameter] = member.parameters;
        current.readonly = false;
        current.typeText = parameter
          ? getTypeTextForNode(parameter, checker, sourceFile)
          : current.typeText;
      }

      accessors.set(name, current);
      continue;
    }

    if (!ts.isMethodDeclaration(member)) {
      continue;
    }

    const name = getPropertyName(member.name, sourceFile);
    if (!name || shouldExcludeMethod(name)) {
      continue;
    }

    const signature = checker.getSignatureFromDeclaration(member);
    methods.push({
      kind: 'method',
      name,
      parameters: member.parameters.map((parameter, index) => ({
        name: getParameterName(parameter.name, sourceFile, index),
        typeText: getTypeTextForNode(parameter, checker, sourceFile),
      })),
      returnTypeText: signature
        ? typeToString(checker, checker.getReturnTypeOfSignature(signature), member)
        : undefined,
    });
  }

  return [
    ...fields.sort(sortByName),
    ...Array.from(accessors.values()).sort(sortByName),
    ...methods.sort(sortByName),
  ];
}

function extractEvents(declaration, checker) {
  const events = new Map();

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'dispatchEvent'
    ) {
      const [eventNode] = node.arguments;
      const event = eventNode ? extractEvent(eventNode, checker) : undefined;
      if (event) {
        events.set(event.name, event);
      }
    }

    node.forEachChild(visit);
  }

  declaration.forEachChild(visit);

  return Array.from(events.values()).sort(sortByName);
}

function extractEvent(eventNode, checker) {
  if (
    !ts.isNewExpression(eventNode) ||
    !ts.isIdentifier(eventNode.expression) ||
    (eventNode.expression.text !== 'Event' &&
      eventNode.expression.text !== 'CustomEvent')
  ) {
    return undefined;
  }

  const [nameNode] = eventNode.arguments ?? [];
  if (!nameNode || !ts.isStringLiteralLike(nameNode)) {
    return undefined;
  }

  return {
    name: nameNode.text,
    typeText: typeToString(checker, checker.getTypeAtLocation(eventNode), eventNode),
  };
}

function extractReactProperties(attributes, members) {
  const writableMembers = new Set(
    members
      .filter((member) => member.kind === 'field' && !member.readonly)
      .map((member) => member.name),
  );
  const properties = new Map();

  for (const memberName of writableMembers) {
    properties.set(memberName, {
      memberName,
      name: memberName,
    });
  }

  for (const attribute of attributes) {
    if (!writableMembers.has(attribute.propertyName)) {
      continue;
    }

    properties.set(attribute.name, {
      memberName: attribute.propertyName,
      name: attribute.name,
    });
  }

  return Array.from(properties.values()).sort(sortByName);
}

function resolveSuperclassName(declaration, sourceFile) {
  const heritageClause = declaration.heritageClauses?.find(
    (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
  );
  const typeNode = heritageClause?.types[0];
  if (!typeNode) {
    return 'HTMLElement';
  }

  return typeNode.expression.getText(sourceFile);
}

function resolveCustomElementTag(declaration, tagConstants, sourceFile) {
  for (const decorator of readDecorators(declaration)) {
    if (!isDecoratorNamed(decorator, 'customElement', sourceFile)) {
      continue;
    }

    const callExpression = getCallExpression(decorator);
    const [tagArgument] = callExpression?.arguments ?? [];
    if (!tagArgument) {
      continue;
    }

    if (ts.isStringLiteralLike(tagArgument)) {
      return tagArgument.text;
    }

    if (ts.isIdentifier(tagArgument)) {
      return tagConstants.get(tagArgument.text);
    }
  }

  return undefined;
}

function extractTagConstants(sourceFile) {
  const constants = new Map();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        ts.isStringLiteralLike(declaration.initializer)
      ) {
        constants.set(declaration.name.text, declaration.initializer.text);
      }
    }
  }

  return constants;
}

function getAttributeName(propertyDecorator, propertyName, sourceFile) {
  const callExpression = getCallExpression(propertyDecorator);
  const [optionsNode] = callExpression?.arguments ?? [];

  if (!optionsNode || !ts.isObjectLiteralExpression(optionsNode)) {
    return propertyName.toLowerCase();
  }

  for (const property of optionsNode.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const name = getPropertyName(property.name, sourceFile);
    if (name !== 'attribute') {
      continue;
    }

    if (property.initializer.kind === ts.SyntaxKind.FalseKeyword) {
      return undefined;
    }

    if (property.initializer.kind === ts.SyntaxKind.TrueKeyword) {
      return propertyName.toLowerCase();
    }

    if (ts.isStringLiteralLike(property.initializer)) {
      return property.initializer.text;
    }
  }

  return propertyName.toLowerCase();
}

function getTypeTextForNode(node, checker, sourceFile) {
  if ('type' in node && node.type) {
    return typeToString(checker, checker.getTypeFromTypeNode(node.type), node.type);
  }

  if ('name' in node && node.name) {
    return typeToString(checker, checker.getTypeAtLocation(node.name), node.name);
  }

  return typeToString(checker, checker.getTypeAtLocation(node), sourceFile);
}

function typeToString(checker, type, enclosingNode) {
  return checker.typeToString(type, enclosingNode, TYPE_FORMAT_FLAGS);
}

function isNonPublicInstanceMember(member) {
  return hasModifier(member, ts.SyntaxKind.StaticKeyword) || isPrivateLike(member);
}

function isPrivateLike(member) {
  return (
    hasModifier(member, ts.SyntaxKind.PrivateKeyword) ||
    hasModifier(member, ts.SyntaxKind.ProtectedKeyword)
  );
}

function hasModifier(node, kind) {
  return node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
}

function shouldExcludeMethod(name) {
  return EXCLUDED_METHOD_NAMES.has(name) || name.endsWith('Callback');
}

function getParameterName(nameNode, sourceFile, index) {
  if (ts.isIdentifier(nameNode)) {
    return nameNode.text;
  }

  return getPropertyName(nameNode, sourceFile) ?? `param${index + 1}`;
}

function getPropertyName(nameNode, sourceFile) {
  if (ts.isIdentifier(nameNode) || ts.isPrivateIdentifier(nameNode)) {
    return nameNode.text;
  }

  if (ts.isStringLiteralLike(nameNode) || ts.isNumericLiteral(nameNode)) {
    return nameNode.text;
  }

  if (ts.isComputedPropertyName(nameNode) && ts.isStringLiteralLike(nameNode.expression)) {
    return nameNode.expression.text;
  }

  return nameNode.getText(sourceFile);
}

function readDecorators(node) {
  if (!ts.canHaveDecorators(node)) {
    return [];
  }

  return ts.getDecorators(node) ?? [];
}

function isDecoratorNamed(decorator, decoratorName, sourceFile) {
  const callExpression = getCallExpression(decorator);
  const expression = callExpression?.expression ?? decorator.expression;

  if (ts.isIdentifier(expression)) {
    return expression.text === decoratorName;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return getPropertyName(expression.name, sourceFile) === decoratorName;
  }

  return false;
}

function getCallExpression(decorator) {
  return ts.isCallExpression(decorator.expression) ? decorator.expression : undefined;
}

function dedupeByName(items) {
  const map = new Map();

  for (const item of items) {
    map.set(item.name, item);
  }

  return Array.from(map.values()).sort(sortByName);
}

function sortByName(left, right) {
  return left.name.localeCompare(right.name);
}

function toPosixPath(filePath) {
  return filePath.replace(/\\/g, '/');
}
