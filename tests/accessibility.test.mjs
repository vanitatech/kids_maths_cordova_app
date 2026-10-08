import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

async function loadView(name) {
  const source = readFileSync(new URL(`../www/js/views/${name}.js`, import.meta.url), 'utf8');
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default;
}

test('answer choices are labelled native buttons', async () => {
  const view = await loadView('lessonActivityView');
  const html = view.getOptionsHtml([1, 2, 3]);
  assert.equal((html.match(/<button\b/g) || []).length, 3);
  for (const value of [1, 2, 3]) {
    assert.ok(html.includes(`aria-label="Choose ${value}"`));
    assert.ok(html.includes(`data-number="${value}"`));
  }
  assert.ok(view.getImagesHtml(3, 'banana.svg').includes('aria-label="3 objects"'));
});

test('score images describe correctness rather than colour alone', async () => {
  const view = await loadView('lessonActivityView');
  const images = [];
  globalThis.document = {
    getElementById: () => ({ innerHTML: '', appendChild: image => images.push(image) }),
    createElement: () => ({ setAttribute() {} }),
  };
  try {
    view.renderScore([
      { completed: true, correct: true },
      { completed: true, correct: false },
      { completed: false },
    ]);
    assert.deepEqual(images.map(image => image.alt), [
      'Question 1: correct', 'Question 2: completed without a star', 'Question 3: not completed',
    ]);
  } finally {
    delete globalThis.document;
  }
});

test('lesson progress and available stars have accessible values', async () => {
  const view = await loadView('userProgressView');
  const elements = new Map();
  globalThis.document = { getElementById(id) {
    if (!elements.has(id)) elements.set(id, { style: {}, attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } });
    return elements.get(id);
  } };
  try {
    view.renderProgressBar(2, 12);
    view.renderProgressStars(8);
    assert.equal(elements.get('progress-background').attrs['aria-valuenow'], 2);
    assert.equal(elements.get('progress-background').attrs['aria-valuetext'], '2 of 12 lessons completed');
    assert.equal(elements.get('progress-stars-button').attrs['aria-label'], 'Mascot friends, 8 stars available');
  } finally {
    delete globalThis.document;
  }
});
