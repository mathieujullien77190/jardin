// MapLibre 6 ships its worker as a standalone ES module. Bundlers cannot resolve
// it reliably, so we serve it as a static file from /public/maplibre/.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const from = resolve(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs');
const outDir = resolve(root, 'public/maplibre');

mkdirSync(outDir, { recursive: true });
copyFileSync(from, resolve(outDir, 'maplibre-gl-worker.mjs'));
console.log('maplibre worker copied to public/maplibre/');
