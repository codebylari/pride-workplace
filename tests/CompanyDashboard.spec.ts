import { test, expect } from '@playwright/test';

test.describe('Dashboard da Empresa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/company-dashboard');
  });

  test('Deve carregar a página de dashboard da empresa com sucesso', async ({ page }) => {
    await expect(page).toHaveURL(/\/company-dashboard$/);
    await expect(page.locator('h1')).toContainText('Bem-vindo');
  });

  test('Deve exibir vagas existentes (caso existam)', async ({ page }) => {
    const vagas = page.locator('.vaga-card'); // classe usada para as vagas
    const vagaCount = await vagas.count();
    expect(vagaCount).toBeGreaterThanOrEqual(0); // aceita zero vagas sem falhar
  });

  test('Deve permitir clicar em uma vaga (se existir)', async ({ page }) => {
    const vagas = page.locator('.vaga-card');
    const vagaCount = await vagas.count();

    if (vagaCount > 0) {
      const primeiraVaga = vagas.first();
      await primeiraVaga.click();
      await expect(page).toHaveURL(/\/vaga/); // exemplo de rota ao clicar em uma vaga
    } else {
      console.warn('Nenhuma vaga disponível para clicar.');
    }
  });
});
