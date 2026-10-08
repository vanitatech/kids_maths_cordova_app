import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../www/js/services/progressStorage.js', import.meta.url), 'utf8');
const { mathsStorageKeys, validateProgress, resetMathsData, isResetAnswerCorrect } =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

function storage(entries = []) {
  const data = new Map(entries);
  return {
    data,
    getItem: key => data.get(key) ?? null,
    removeItem: key => data.delete(key),
  };
}

test('fresh and valid existing progress is preserved', () => {
  const saved = storage([['userProgress.currentLessonId', '2'], ['userProgress.pointsAwarded', '10']]);
  validateProgress(storage(), [1, 2], [1], [1]);
  validateProgress(saved, [1, 2], [1], [1]);
  assert.equal(saved.getItem('userProgress.currentLessonId'), '2');
});

test('invalid numbers, references and overspent points report errors without erasure', () => {
  for (const [field, value] of [
    ['pointsAwarded', 'NaN'], ['pointsAwarded', '-1'], ['pointsAwarded', '3.2'],
    ['pointsAwarded', '9007199254740992'], ['pointsAwarded', ''],
    ['currentLessonId', '99'], ['currentMascot', '99'], ['currentActivityId', '99'],
    ['currentQuestionId', '5'], ['pointsRedeemed', '1'], ['currentActivityType', 'unknown'],
  ]) {
    const saved = storage([[`userProgress.${field}`, value]]);
    assert.throws(() => validateProgress(saved, [1, 2], [1], [1]), /Saved Maths Kids/);
    assert.equal(saved.getItem(`userProgress.${field}`), value);
  }
});

test('reset deletes only the known maths keys and waits for database deletion', async () => {
  const saved = storage([
    ...mathsStorageKeys.map(key => [key, 'value']),
    ['store.token', 'keep'], ['userProgress.unrelated', 'keep'], ['hindi.setting', 'keep'],
  ]);
  let deleted = false;
  let reloaded = false;
  await resetMathsData({ delete: async () => {
    await new Promise(resolve => setImmediate(resolve));
    deleted = true;
  } }, saved, () => { assert.equal(deleted, true); reloaded = true; });
  assert.equal(reloaded, true);
  assert.deepEqual([...saved.data.keys()], ['store.token', 'userProgress.unrelated', 'hindi.setting']);
});

test('database deletion failure preserves browser storage and prevents reload', async () => {
  const saved = storage([['userProgress.pointsAwarded', '12']]);
  await assert.rejects(resetMathsData({ delete: async () => { throw new Error('blocked'); } },
    saved, assert.fail), /blocked/);
  assert.equal(saved.getItem('userProgress.pointsAwarded'), '12');
});

test('parent challenge rejects empty, decimal and malformed answers', () => {
  assert.equal(isResetAnswerCorrect('15', '15'), true);
  for (const answer of ['', ' ', '15abc', '15.0', '-15', '14']) {
    assert.equal(isResetAnswerCorrect(answer, '15'), false);
  }
});
