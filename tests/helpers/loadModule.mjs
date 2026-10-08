import { readFileSync } from 'node:fs';

// The Cordova package stays CommonJS; load its browser ES modules without changing it.
export function moduleUrl(url, replacements = {}) {
  let source = readFileSync(url, 'utf8');
  source = source.replace(/from (['"])(\.[^'"]+)\1/g, (match, quote, specifier) => {
    const dependency = replacements[specifier]
      ? `data:text/javascript;base64,${Buffer.from(replacements[specifier]).toString('base64')}`
      : moduleUrl(new URL(specifier, url), replacements);
    return `from ${quote}${dependency}${quote}`;
  });
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
}

export async function loadModule(path, replacements) {
  return import(moduleUrl(new URL(`../../${path}`, import.meta.url), replacements));
}
