import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.MATHS_PREVIEW_ROOT
  ? resolve(process.env.MATHS_PREVIEW_ROOT)
  : fileURLToPath(new URL('../www/', import.meta.url));
const mount = '/demos/kids-maths/';
const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
  '.png': 'image/png', '.ttf': 'font/ttf',
};

http.createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch (error) {
    if (!(error instanceof URIError || error instanceof TypeError)) throw error;
    response.writeHead(400).end();
    return;
  }
  if (!pathname.startsWith(mount)) {
    response.writeHead(404).end();
    return;
  }
  const filename = resolve(root, pathname.slice(mount.length) || 'index.html');
  if (!filename.startsWith(root.endsWith(sep) ? root : root + sep)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(filename);
    response.writeHead(200, {
      'Content-Type': types[extname(filename)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(content);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      response.writeHead(404).end();
    } else {
      console.error('Maths preview read failed:', error);
      response.writeHead(500).end();
    }
  }
}).listen(8769, '127.0.0.1', () => console.log(`Maths preview: http://127.0.0.1:8769${mount}`));
