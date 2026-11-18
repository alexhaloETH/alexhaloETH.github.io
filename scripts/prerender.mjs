// Bake the rendered page into dist/index.html after `vite build`.
// The site is static content, so rendering it once at build time means phones get
// the full page in the first response instead of a blank screen while React loads.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const serverEntry = pathToFileURL(`${root}dist-server/entry-server.js`).href;
const indexPath = `${root}dist/index.html`;
const placeholder = '<div id="root"></div>';

const { render } = await import(serverEntry);
const html = readFileSync(indexPath, 'utf8');
if (!html.includes(placeholder)) {
  throw new Error(`prerender: ${placeholder} not found in dist/index.html`);
}

writeFileSync(indexPath, html.replace(placeholder, `<div id="root">${render()}</div>`));
rmSync(`${root}dist-server`, { recursive: true, force: true });
console.log('prerender: baked the page into dist/index.html');
