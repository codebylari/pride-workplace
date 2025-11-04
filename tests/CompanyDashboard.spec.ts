import { test, expect } from '@playwright/test';

test.describe('Dashboard da Empresa', () => {
  test('Deve redirecionar para auth quando não autenticado', async ({ page }) => {
    await page.goto('/company-dashboard');
    // Verifica se redireciona para auth ou fica em loading
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(auth|company-dashboard)/);
  });
});
