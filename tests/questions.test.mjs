import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule } from './helpers/loadModule.mjs';

for (const type of ['counting', 'addition', 'subtraction']) {
  test(`${type} curriculum generates five answerable questions per activity`, async () => {
    const { default: activities } = await loadModule(`www/data/activities_${type}.js`);
    const replacements = {
      [`../models/${type}ActivityModel.js`]: `export default { get: async id => ${JSON.stringify(activities)}.find(a => a.id === id) };`,
    };
    const { default: controller } = await loadModule(`www/js/controllers/${type}ActivityController.js`, replacements);
    const original = Math.random;
    let seed = 42;
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    try {
      for (const activity of activities) {
        const questions = await controller.createQuestions(activity.id);
        assert.equal(questions.length, 5);
        assert.deepEqual(questions.map(q => q.id), [0, 1, 2, 3, 4]);
        const operands = [];
        for (const question of questions) {
          assert.equal(question.completed, false);
          assert.ok(Number.isInteger(question.total) && question.total >= 0);
          const required = type === 'counting' ? [question.total]
            : type === 'addition' ? [question.augend, question.addend, question.total]
              : [question.minuend, question.subtrahend, question.total];
          const remaining = [...question.options];
          for (const answer of required) {
            const index = remaining.indexOf(answer);
            assert.notEqual(index, -1, `${type} ${activity.id} is missing a usable answer card`);
            remaining.splice(index, 1);
          }
          if (type === 'addition') assert.equal(question.total, question.augend + question.addend);
          if (type === 'subtraction') assert.equal(question.total, question.minuend - question.subtrahend);
          operands.push(type === 'counting' ? question.total : question.augend ?? question.minuend);
        }
        assert.equal(new Set(operands).size, 5);
      }
    } finally {
      Math.random = original;
    }
  });
}
