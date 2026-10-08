import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
const source = readFileSync(require.resolve('dexie'), 'utf8');
const version = source.match(/Version ([\d.]+)/)?.[1];
if (version !== manifest.dependencies.dexie) {
  throw new Error(`Expected Dexie ${manifest.dependencies.dexie}, found ${version}.`);
}
const minified = readFileSync(new URL('../node_modules/dexie/dist/dexie.min.js', import.meta.url));
const destination = new URL('../www/js/lib/dexie.min.js', import.meta.url);
if (process.argv.includes('--check')) {
  if (!readFileSync(destination).equals(minified)) {
    throw new Error('Vendored Dexie differs from the pinned dependency. Run npm run vendor:dexie.');
  }
} else {
  writeFileSync(destination, minified);
}
