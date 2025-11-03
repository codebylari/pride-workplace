import { test, expect } from '@playwright/test';

test('teste simples', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});