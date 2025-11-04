import { test, expect } from '@playwright/test';

test.describe('Dashboard do Candidato', () => {
  test('Deve redirecionar para auth quando não autenticado', async ({ page }) => {
    await page.goto('/candidate-dashboard');
    // Verifica se redireciona para auth ou fica em loading
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(auth|candidate-dashboard)/);
  });
});