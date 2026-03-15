import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectComponentMetadata } from './component-metadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_OUTPUT_FILE = path.resolve(__dirname, '../src/custom-elements.json');

export async function writeCustomElementsManifest(outputFile = DEFAULT_OUTPUT_FILE) {
  const { components } = await collectComponentMetadata();
  const manifest = {
    schemaVersion: '2.1.0',
    modules: components.map((component) => ({
      declarations: [
        {
          attributes: component.attributes.map((attribute) => ({
            fieldName: attribute.propertyName,
            name: attribute.name,
            type: attribute.typeText ? { text: attribute.typeText } : undefined,
          })),
          customElement: true,
          events: component.events.map((event) => ({
            name: event.name,
            type: { text: event.typeText },
          })),
          kind: 'class',
          members: component.members.map((member) =>
            member.kind === 'method'
              ? {
                  kind: 'method',
                  name: member.name,
                  parameters: member.parameters.map((parameter) => ({
                    name: parameter.name,
                    type: parameter.typeText ? { text: parameter.typeText } : undefined,
                  })),
                  return: member.returnTypeText
                    ? { type: { text: member.returnTypeText } }
                    : undefined,
                }
              : {
                  kind: 'field',
                  name: member.name,
                  readonly: member.readonly || undefined,
                  type: member.typeText ? { text: member.typeText } : undefined,
                },
          ),
          name: component.className,
          superclass: { name: component.superclassName },
          tagName: component.tagName,
        },
      ],
      exports: [
        {
          declaration: { name: component.className },
          kind: 'js',
          name: component.className,
        },
        {
          declaration: { name: component.className },
          kind: 'custom-element-definition',
          name: component.tagName,
        },
      ],
      kind: 'javascript-module',
      path: component.modulePath,
    })),
  };

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return components.length;
}

async function main() {
  const outputFile = getOutputFile();
  const componentCount = await writeCustomElementsManifest(outputFile);
  console.log(`Generated a custom elements manifest for ${componentCount} components.`);
}

function getOutputFile() {
  const [outputArg] = process.argv.slice(2);
  if (!outputArg) {
    return DEFAULT_OUTPUT_FILE;
  }

  return path.resolve(process.cwd(), outputArg);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
