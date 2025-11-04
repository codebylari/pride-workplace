import { test, expect } from '@playwright/test';

test.describe('Index (Home Page)', () => {
  test('Deve carregar a página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verifica se está na página inicial
    await expect(page).toHaveURL(/\/$/);
  });

  test('Deve ter links para autenticação', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verifica se existem links/botões de navegação
    const hasAuthLink = await page.locator('a[href*="auth"], button:has-text("Login"), button:has-text("Entrar")').count();
    expect(hasAuthLink).toBeGreaterThan(0);
  });
});
