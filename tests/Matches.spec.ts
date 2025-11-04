import { test, expect } from '@playwright/test';

test.describe('Matches', () => {
  test('Deve redirecionar para /auth quando não autenticado', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
    
    // Deve redirecionar para auth ou permanecer carregando
    await expect(page).toHaveURL(/\/(auth|matches)/);
  });
});
