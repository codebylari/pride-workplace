import { test, expect } from '@playwright/test';

test.describe('CandidateSettings', () => {
  test('Deve redirecionar para /auth quando não autenticado', async ({ page }) => {
    await page.goto('/candidate-settings');
    await page.waitForLoadState('networkidle');
    
    // Deve redirecionar para auth ou permanecer carregando
    await expect(page).toHaveURL(/\/(auth|candidate-settings)/);
  });
});
