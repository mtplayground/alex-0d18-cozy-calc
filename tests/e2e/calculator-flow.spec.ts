import { expect, type Page, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Calculator display')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Calculator buttons' })).toBeVisible();
  await expect(page.getByLabel('Current entry')).toHaveText('0');
});

test('completes everyday chained math and shows display animations', async ({ page }) => {
  await expectNoDocumentScroll(page);

  await press(page, 'Digit 1');
  await expect(page.getByLabel('Current entry')).toHaveText('1');
  await expect(page.getByLabel('Current entry')).toHaveClass(/calculator-display-update/);
  await expect(page.getByLabel('Current entry')).not.toHaveClass(/calculator-display-update/);

  await press(page, 'Digit 2');
  await press(page, 'Add');
  await press(page, 'Digit 7');
  await press(page, 'Multiply');
  await press(page, 'Digit 3');
  await press(page, 'Equals');

  await expect(page.getByLabel('Current entry')).toHaveText('33');
  await expect(page.getByLabel('Current entry')).toHaveClass(/calculator-display-settle/);
  await expect(page.getByLabel('Current entry')).not.toHaveClass(/calculator-display-settle/);
});

test('calculates a percentage-based tip flow', async ({ page }) => {
  await press(page, 'Digit 5');
  await press(page, 'Digit 0');
  await press(page, 'Multiply');
  await press(page, 'Digit 2');
  await press(page, 'Digit 0');
  await press(page, 'Percent');
  await expect(page.getByLabel('Current entry')).toHaveText('0.2');

  await press(page, 'Equals');
  await expect(page.getByLabel('Current entry')).toHaveText('10');
  await expect(page.getByLabel('Current entry')).toHaveClass(/calculator-display-settle/);
});

test('supports clear and all-clear during a tap sequence', async ({ page }) => {
  await press(page, 'Digit 9');
  await press(page, 'Add');
  await press(page, 'Digit 4');
  await press(page, 'Digit 2');
  await press(page, 'Clear');
  await expect(page.getByLabel('Current entry')).toHaveText('0');

  await press(page, 'Digit 1');
  await press(page, 'Equals');
  await expect(page.getByLabel('Current entry')).toHaveText('10');

  await press(page, 'All clear');
  await expect(page.getByLabel('Current entry')).toHaveText('0');
  await expect(page.getByLabel('Running value')).toHaveText('0');
});

async function press(page: Page, accessibleName: string) {
  await page.getByRole('button', { name: accessibleName, exact: true }).click();
}

async function expectNoDocumentScroll(page: Page) {
  const hasNoScroll = await page.evaluate(
    () => document.documentElement.scrollHeight <= window.innerHeight + 1,
  );
  expect(hasNoScroll).toBe(true);
}
