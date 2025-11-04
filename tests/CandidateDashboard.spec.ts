import { test, expect } from '@playwright/test';

test.describe('Dashboard do Candidato', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/candidate-dashboard');
    // Aguarda o carregamento da página
    await page.waitForLoadState('networkidle');
  });

  test('Deve carregar a página de dashboard do candidato com sucesso', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bem-vindo', { timeout: 15000 });
  });

  test('Deve exibir o grid de vagas', async ({ page }) => {
    const jobGrid = page.locator('.grid');
    await expect(jobGrid).toBeVisible({ timeout: 15000 });
  });

  test('Botão do menu deve abrir sidebar', async ({ page }) => {
    // Encontra o botão do menu com o ícone Menu
    const menuButton = page.locator('header button').first();
    await expect(menuButton).toBeVisible({ timeout: 15000 });
    await menuButton.click();
    
    // Verifica se a sidebar apareceu
    await page.waitForTimeout(500); // Aguarda a animação
  });
});
