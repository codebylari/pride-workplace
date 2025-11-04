import { test, expect } from '@playwright/test';

test.describe('Dashboard Candidato', () => {
  test.beforeEach(async ({ page }) => {
    // Abre diretamente a página do dashboard (sem login)
    await page.goto('/candidate-dashboard');
  });

  test('Deve exibir o campo de busca', async ({ page }) => {
    await expect(page.getByPlaceholder('Buscar')).toBeVisible();
  });

  test.skip('Deve exibir pelo menos uma vaga', async ({ page }) => {
    // Depende de dados no banco; pulando no ambiente local.
  });

  test.skip('Deve permitir clicar em uma vaga e ver detalhes', async ({ page }) => {
    // Depende de vagas existentes; pulando no ambiente local.
  });

  test.skip('Buscar vagas pelo nome', async ({ page }) => {
    // Comportamento depende de dados; pulando no ambiente local.
  });

  test('Menu e logout funcionam', async ({ page }) => {
    await page.locator('header button').first().click();
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/(auth)?$/);
  });

});
