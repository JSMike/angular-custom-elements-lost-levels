import { installWindowOnGlobal } from '@lit-labs/ssr/lib/dom-shim.js';
import { getElementRenderer } from '@lit-labs/ssr/lib/element-renderer.js';
import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const boxElementPattern =
  /<(boxes-(?:calendar-picker|checkbox|combobox|multi-select))\b([^>]*)>([\s\S]*?)<\/\1>/g;

installWindowOnGlobal();

await import('@/boxes/calendar-picker');
await import('@/boxes/checkbox');
await import('@/boxes/combobox');
await import('@/boxes/multi-select');

const app = express();
const angularApp = new AngularNodeAppEngine();

type BoxElementRenderer = ReturnType<typeof getElementRenderer>;

type LitRenderInfo = {
  customElementHostStack: BoxElementRenderer[];
  customElementInstanceStack: BoxElementRenderer[];
  deferHydration: boolean;
  elementRenderers: Array<typeof LitElementRenderer>;
  eventTargetStack: Array<HTMLElement | undefined>;
  slotStack: Array<string | undefined>;
};

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (!response) {
        next();
        return;
      }

      /**
       * This is the entrypoint for Lit SSR
       */
      const transformedResponse = await transformLitSsrResponse(response);
      return writeResponseToNodeResponse(transformedResponse, res);
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4400;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

async function transformLitSsrResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const transformedHtml = await renderBoxesDeclarativeShadowDom(html);

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(transformedHtml === html ? html : transformedHtml, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

async function renderBoxesDeclarativeShadowDom(html: string) {
  const matches = Array.from(html.matchAll(boxElementPattern));

  if (matches.length === 0) {
    return html;
  }

  let nextHtml = '';
  let lastIndex = 0;

  for (const match of matches) {
    const matchIndex = match.index;

    if (matchIndex === undefined) {
      continue;
    }

    const [fullMatch, tagName, attributeText, lightDomHtml] = match;
    nextHtml += html.slice(lastIndex, matchIndex);
    nextHtml += await renderBoxElementHtml(
      tagName,
      attributeText,
      lightDomHtml,
      fullMatch,
    );
    lastIndex = matchIndex + fullMatch.length;
  }

  nextHtml += html.slice(lastIndex);
  return nextHtml;
}

async function renderBoxElementHtml(
  tagName: string,
  attributeText: string,
  lightDomHtml: string,
  originalHtml: string,
) {
  try {
    const attributes = parseHtmlAttributes(attributeText);
    const renderInfo = createLitRenderInfo();
    const renderer = getElementRenderer(
      renderInfo,
      tagName,
      undefined,
      attributes,
    );

    for (const [name, value] of attributes) {
      renderer.element?.setAttribute(name, value);
      applyServerProperty(renderer, name, value);
    }

    renderer.connectedCallback();
    renderInfo.customElementInstanceStack.push(renderer);
    renderInfo.customElementHostStack.push(renderer);

    const shadowContents = renderer.renderShadow(renderInfo);

    if (shadowContents === undefined) {
      return originalHtml;
    }

    const shadowHtml = await collectResult(shadowContents);
    const hostAttributes = renderer.renderAttributes().join('');
    const templateAttributes = getShadowRootTemplateAttributes(renderer);

    return `<${tagName}${hostAttributes}><template ${templateAttributes}>${shadowHtml}</template>${lightDomHtml}</${tagName}>`;
  } catch (error) {
    console.warn(`Unable to render ${tagName} with Lit SSR.`, error);
    return originalHtml;
  }
}

function createLitRenderInfo(): LitRenderInfo {
  return {
    customElementHostStack: [],
    customElementInstanceStack: [],
    deferHydration: false,
    elementRenderers: [LitElementRenderer],
    eventTargetStack: [],
    slotStack: [],
  };
}

function getShadowRootTemplateAttributes(renderer: BoxElementRenderer) {
  const { delegatesFocus, mode = 'open' } = renderer.shadowRootOptions ?? {};
  const attributes = [`shadowroot="${mode}"`, `shadowrootmode="${mode}"`];

  if (delegatesFocus) {
    attributes.push('shadowrootdelegatesfocus');
  }

  return attributes.join(' ');
}

function parseHtmlAttributes(attributeText: string) {
  const attributes = new Map<string, string>();
  const attributePattern =
    /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of attributeText.matchAll(attributePattern)) {
    const name = match[1];

    if (!name) {
      continue;
    }

    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attributes.set(name, value);
  }

  return attributes;
}

function applyServerProperty(
  renderer: BoxElementRenderer,
  attributeName: string,
  attributeValue: string,
) {
  if (!renderer.element) {
    return;
  }

  const element = renderer.element as HTMLElement & Record<string, unknown>;
  const propertyName =
    attributeName === 'class' ? 'className' : attributeName;

  if (!(propertyName in element)) {
    return;
  }

  const currentValue = element[propertyName];

  if (typeof currentValue === 'boolean') {
    renderer.setProperty(propertyName, attributeValue !== 'false');
    return;
  }

  renderer.setProperty(propertyName, attributeValue);
}
