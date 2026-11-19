// Render the app to static HTML at build time, so the page reads before any script runs.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const { render } = await import(pathToFileURL(`${root}dist-server/entry-server.js`).href);
const file = `${root}dist/index.html`;
const html = readFileSync(file, 'utf8');
if (!html.includes('<!--app-->')) throw new Error('dist/index.html has no <!--app--> placeholder');
writeFileSync(file, html.replace('<!--app-->', render()));
rmSync(`${root}dist-server`, { recursive: true, force: true });
console.log('prerendered dist/index.html');
