import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export async function releaseFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!/^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/.test(entry.name) || entry.isSymbolicLink()) {
      throw new Error(`Unsafe browser release entry: ${prefix}${entry.name}`);
    }
    if (entry.isDirectory()) {
      files.push(...await releaseFiles(resolve(directory, entry.name), `${prefix}${entry.name}/`));
    } else if (entry.isFile()) {
      files.push(`${prefix}${entry.name}`);
    } else {
      throw new Error(`Unsupported browser release entry: ${prefix}${entry.name}`);
    }
  }
  return files.sort();
}

export async function buildBrowser(output, sha) {
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('A full lowercase RELEASE_SHA is required.');
  const source = fileURLToPath(new URL('../www/', import.meta.url));
  output = resolve(output);
  if (output === resolve(source) || output.startsWith(source)) {
    throw new Error('Browser output must be outside the Cordova source directory.');
  }
  await releaseFiles(source);
  // Require a new output directory so a previous build cannot leave stale assets behind.
  await mkdir(output);
  await cp(source, output, {
    recursive: true,
    filter: path => !path.endsWith('/cordova.js'),
  });
  const index = resolve(output, 'index.html');
  let html = await readFile(index, 'utf8');
  if (!html.includes('<script src="cordova.js"></script>')) {
    throw new Error('Expected the Cordova runtime tag in the source page.');
  }
  html = html.replace('    <!-- Cordova platforms supply this runtime; ordinary web hosting does not. -->\n', '')
    .replace('    <script src="cordova.js"></script>\n', '')
    .replace(' https://ssl.gstatic.com/accessibility/javascript/android/', '')
    .replace('frame-src gap:', "frame-src 'none'");
  await writeFile(index, html);
  await writeFile(resolve(output, 'release.txt'), `${sha}\n`);
  const manifest = [];
  for (const name of await releaseFiles(output)) {
    const digest = createHash('sha256').update(await readFile(resolve(output, name))).digest('hex');
    manifest.push(`${digest}  ${name}`);
  }
  await writeFile(resolve(output, 'SHA256SUMS'), `${manifest.join('\n')}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = resolve(process.argv[2] || 'dist/site');
  await mkdir(resolve(output, '..'), { recursive: true });
  await buildBrowser(output, process.env.RELEASE_SHA);
  console.log(`Browser release built: ${output}`);
}
