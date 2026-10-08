import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { loadModule } from './helpers/loadModule.mjs';

const { bindActions, actionId } = await loadModule('www/js/services/actions.js');
const { objectImages, objectImageUrl } = await loadModule('www/js/services/objectImages.js');

test('CSP disallows inline code, eval, remote media and embedded objects', () => {
  const html = readFileSync(new URL('../www/index.html', import.meta.url), 'utf8');
  const policy = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/)[1];
  assert.ok(policy.includes("default-src 'none'"));
  for (const directive of ["style-src 'self'", "img-src 'self'", "object-src 'none'",
    "base-uri 'none'", "form-action 'none'"]) {
    assert.ok(policy.includes(directive));
  }
  assert.doesNotMatch(policy, /unsafe-inline|unsafe-eval|\*/);
  assert.doesNotMatch(html, /\bon\w+\s*=/i);
  assert.doesNotMatch(html, /<script[^>]*>\s*\S[^<]*<\/script>/i);
  const views = new URL('../www/js/views/', import.meta.url);
  for (const name of readdirSync(views)) {
    assert.doesNotMatch(readFileSync(new URL(name, views), 'utf8'), /onclick|\bon\w+\s*=/i, name);
  }
});

test('offline app declares no remote access or external URL intents', () => {
  const config = readFileSync(new URL('../config.xml', import.meta.url), 'utf8');
  assert.doesNotMatch(config, /<access\b|<allow-intent\b|<allow-navigation\b/);
});

test('only bundled object images can be rendered from saved progress', () => {
  for (const image of objectImages) {
    assert.equal(objectImageUrl(image), `img/objects/${image}`);
    assert.ok(readFileSync(new URL(`../www/img/objects/${image}`, import.meta.url)).length);
  }
  for (const image of [null, '../home.svg', 'https://example.com/image.svg', 'banana.svg" onerror="alert(1)']) {
    assert.throws(() => objectImageUrl(image), /invalid/);
  }
});

test('action identifiers reject missing, malformed and unsafe integers', () => {
  assert.equal(actionId({ dataset: { id: '12' } }), 12);
  for (const id of [undefined, '', '0', '-1', '1.2', '1abc', '9007199254740992']) {
    assert.throws(() => actionId({ dataset: { id } }), /Invalid/);
  }
});

test('delegated actions handle dynamic/nested buttons and prevent overlapping requests', async () => {
  let click;
  let release;
  let calls = 0;
  const root = { addEventListener(type, listener) { assert.equal(type, 'click'); click = listener; } };
  const button = { dataset: { action: 'save' }, disabled: false, isConnected: true };
  const event = { target: { closest: () => button } };
  bindActions(root, { save: () => { calls++; return new Promise(resolve => { release = resolve; }); } }, assert.fail);
  const pending = click(event);
  assert.equal(button.disabled, true);
  await click(event);
  assert.equal(calls, 1);
  release();
  await pending;
  assert.equal(button.disabled, false);
});

test('consumed card stays disabled and action failures are reported', async () => {
  let click;
  const errors = [];
  const root = { addEventListener(type, listener) { click = listener; } };
  const button = { dataset: { action: 'choose' }, disabled: false, isConnected: true };
  bindActions(root, {
    choose: target => { target.disabled = true; },
    failure: async () => { throw new Error('Storage failed'); },
  }, error => errors.push(error.message));
  const event = { target: { closest: () => button } };
  await click(event);
  assert.equal(button.disabled, true);
  button.disabled = false;
  button.dataset.action = 'failure';
  await click(event);
  assert.deepEqual(errors, ['Storage failed']);
  assert.equal(button.disabled, false);
  button.dataset.action = 'toString';
  await click(event);
  assert.equal(errors.at(-1), 'Unknown Maths Kids action.');
});
