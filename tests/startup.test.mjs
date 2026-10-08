import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../www/js/services/startup.js', import.meta.url), 'utf8');
const { startWhenReady, seedIfEmpty, worksheetUrl } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);

test('browser starts without deviceready', async () => {
  let started = false;
  startWhenReady({}, false, async () => { started = true; }, assert.fail);
  assert.equal(started, true);
});

test('Cordova waits for readiness and initializes once', async () => {
  let listener;
  let calls = 0;
  startWhenReady({ addEventListener(name, fn) {
    assert.equal(name, 'deviceready');
    listener = fn;
  } }, true, async () => { calls++; }, assert.fail);
  assert.equal(calls, 0);
  await listener();
  await listener();
  assert.equal(calls, 1);
});

test('startup failures reach the error handler', async () => {
  const failure = new Error('storage unavailable');
  let reported;
  startWhenReady({}, false, async () => { throw failure; }, error => { reported = error; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(reported, failure);
});

test('seeding awaits insertion and preserves populated tables', async () => {
  let finished = false;
  await seedIfEmpty({ count: async () => 0, bulkAdd: async () => {
    await new Promise(resolve => setImmediate(resolve));
    finished = true;
  } }, []);
  assert.equal(finished, true);
  await seedIfEmpty({ count: async () => 1, bulkAdd: assert.fail }, []);
});

test('database insertion errors propagate', async () => {
  await assert.rejects(seedIfEmpty({
    count: async () => 0,
    bulkAdd: async () => { throw new Error('insert failed'); },
  }, []), /insert failed/);
});

test('worksheets stay within browser mount and native bundle', () => {
  assert.equal(worksheetUrl('lesson_1.pdf', 'https://example.com/demos/kids-maths/'),
    'https://example.com/demos/kids-maths/worksheets/lesson_1.pdf');
  assert.equal(worksheetUrl('lesson_1.pdf', 'file:///app/www/'),
    'file:///app/www/worksheets/lesson_1.pdf');
  for (const name of ['../secret.pdf', 'https://example.com/file.pdf', 'bad.html']) {
    assert.throws(() => worksheetUrl(name, 'https://example.com/'), /Invalid/);
  }
});
