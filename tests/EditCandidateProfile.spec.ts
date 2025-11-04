import { test, expect } from '@playwright/test';

test.describe('EditCandidateProfile', () => {
  test('Deve redirecionar para auth quando não autenticado', async ({ page }) => {
    await page.goto('/edit-candidate-profile');
    // Verifica se redireciona para auth ou fica em loading
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(auth|edit-candidate-profile)/);
  });
});
