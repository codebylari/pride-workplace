import { test, expect } from '@playwright/test';

test.describe('Index (Home Page)', () => {
  test('Deve carregar a página inicial ou redirecionar para /auth', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verifica se está na página inicial ou foi redirecionado para auth
    await expect(page).toHaveURL(/\/(auth)?$/);
  });

  test('Deve ter links para autenticação se estiver na home', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    
    // Se estiver em /auth, apenas verifica se a página carregou
    if (currentUrl.includes('/auth')) {
      await expect(page.locator('body')).toBeVisible();
    } else {
      // Se estiver na home, verifica links de autenticação
      const hasAuthLink = await page.locator('a[href*="auth"], button:has-text("Login"), button:has-text("Entrar")').count();
      expect(hasAuthLink).toBeGreaterThan(0);
    }
  });
});
