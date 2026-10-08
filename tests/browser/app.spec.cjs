const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      window.cspViolations.push(event.violatedDirective);
    });
  });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Counting', exact: true })).toBeVisible();
});

async function answerQuestion(page, correct = true) {
  while (await page.locator('.card-slot.active').count()) {
    const value = await page.locator('.card-slot.active').getAttribute('data-number');
    const choices = page.locator('.options button:not(:disabled)');
    const matching = choices.filter({ has: page.locator(`.card[data-number="${value}"]`) });
    const other = choices.filter({ hasNot: page.locator(`.card[data-number="${value}"]`) });
    await (correct ? matching : other).first().press('Enter');
  }
  await page.getByRole('button', { name: 'Check Answer', exact: true }).press('Enter');
}

test('complete a mounted lesson by keyboard, award once, persist and advance under CSP', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const type of ['Counting', 'Addition', 'Subtraction']) {
    await page.getByRole('button', { name: type, exact: true }).press('Enter');
    for (let question = 0; question < 5; question++) {
      await expect(page.locator('.options button').first()).toBeFocused();
      await answerQuestion(page);
      if (question < 4) {
        await expect(page.getByRole('img', { name: `Question ${question + 1}: correct`, exact: true })).toBeVisible();
      }
    }
    await expect(page.getByRole('button', { name: `${type}, completed`, exact: true })).toBeVisible();
  }
  await expect(page.locator('#progress-stars-amount')).toHaveText('15');
  await page.evaluate(() => {
    window.worksheetRequests = [];
    HTMLAnchorElement.prototype.click = function () {
      window.worksheetRequests.push({ href: this.href, name: this.download });
    };
  });
  await page.getByRole('button', { name: 'Worksheet', exact: true }).press('Enter');
  await expect(page.getByRole('button', { name: 'Worksheet, completed', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Worksheet, completed', exact: true }).press('Enter');
  await expect(page.getByRole('button', { name: 'Worksheet, completed', exact: true })).toBeEnabled();
  await expect(page.locator('#progress-stars-amount')).toHaveText('20');
  const downloads = await page.evaluate(() => window.worksheetRequests);
  expect(downloads).toHaveLength(2);
  expect(downloads[0]).toEqual({
    href: 'http://127.0.0.1:8769/demos/kids-maths/worksheets/placeholder-worksheet.pdf',
    name: 'placeholder-worksheet.pdf',
  });
  expect((await page.request.get('worksheets/placeholder-worksheet.pdf')).ok()).toBe(true);
  expect(await page.evaluate(() => window.cspViolations)).toEqual([]);
  await page.reload();
  await expect(page.locator('#progress-stars-amount')).toHaveText('20');
  await page.getByRole('button', { name: 'Next Lesson 2', exact: true }).press('Enter');
  await expect(page.locator('#current-lesson-number')).toHaveText('2');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
});

test('wrong answers retry then advance, mascots report cost and reset preserves sibling storage', async ({ page }) => {
  await page.getByRole('button', { name: 'Counting', exact: true }).press('Enter');
  await expect(page.locator('.options button').first()).toBeFocused();
  await answerQuestion(page, false);
  await expect(page.locator('#app-feedback')).toContainText('try again');
  await expect(page.locator('.options button').first()).toBeFocused();
  await answerQuestion(page, false);
  await expect(page.getByRole('img', { name: 'Question 1: completed without a star', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Lessons', exact: true }).press('Enter');
  await page.getByRole('button', { name: /Mascot friends/ }).press('Enter');
  await page.getByRole('button', { name: 'elephant, unlock for 50 stars', exact: true }).press('Enter');
  await expect(page.locator('#app-feedback')).toContainText('You need 50 stars');
  await page.getByRole('button', { name: 'Lessons', exact: true }).press('Enter');
  await page.evaluate(() => localStorage.setItem('sibling.test', 'keep'));
  await page.getByRole('button', { name: 'Reset Maths Kids progress', exact: true }).press('Enter');
  await page.locator('#reset-acknowledge').check();
  const answer = await page.locator('#reset-answer').getAttribute('data-answer');
  await page.locator('#reset-answer').fill(answer);
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: 'Erase Maths Kids progress', exact: true }).press('Enter'),
  ]);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#current-lesson-number')).toHaveText('1');
  await expect(page.locator('#progress-stars-amount')).toHaveText('0');
  expect(await page.evaluate(() => localStorage.getItem('sibling.test'))).toBe('keep');
  expect(await page.evaluate(() => window.cspViolations)).toEqual([]);
});

test('unsafe saved image fails visibly without erasure; inline scripts are blocked', async ({ page }) => {
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.inlineExecuted = true';
    document.body.appendChild(script);
  });
  await expect.poll(() => page.evaluate(() => window.cspViolations.length)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.inlineExecuted)).toBeUndefined();
  await page.evaluate(() => localStorage.setItem('userProgress.currentObjectImage', '../home.svg'));
  await page.reload();
  await expect(page.locator('#startup-error')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('userProgress.currentObjectImage'))).toBe('../home.svg');
});

test('failed action reports an error instead of claiming success or awarding stars', async ({ page }) => {
  await page.getByRole('button', { name: 'Worksheet', exact: true }).evaluate(button => {
    button.dataset.id = 'invalid';
  });
  await page.getByRole('button', { name: 'Worksheet', exact: true }).press('Enter');
  await expect(page.locator('#app-feedback')).toContainText('That action could not finish');
  await expect(page.locator('#progress-stars-amount')).toHaveText('0');
  await expect(page.getByRole('button', { name: 'Worksheet', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Worksheet', exact: true }).evaluate(button => {
    document.getElementById('app').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    button.click();
  });
  await expect(page.locator('#app-feedback')).toBeVisible();
  await expect(page.locator('#loading')).not.toBeVisible();
});

test('packaged release starts without requesting Cordova and disables response caching', async ({ page }) => {
  test.skip(!process.env.MATHS_PREVIEW_ROOT, 'Run against the built browser release.');
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.reload();
  await expect(page.getByRole('button', { name: 'Counting', exact: true })).toBeVisible();
  expect(requests.some(url => url.endsWith('/cordova.js'))).toBe(false);
  const response = await page.request.get('./');
  expect(response.headers()['cache-control']).toBe('no-store');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(await response.text()).not.toContain('cordova.js');
  expect(await page.evaluate(() => window.cspViolations)).toEqual([]);
});
