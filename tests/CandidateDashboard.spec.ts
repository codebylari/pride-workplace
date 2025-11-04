import { test, expect } from '@playwright/test';

test.describe('Dashboard do Candidato', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa diretamente o dashboard do candidato (sem login)
    await page.goto('/candidate-dashboard');
  });

  test('Deve carregar a página de dashboard do candidato com sucesso', async ({ page }) => {
    await expect(page).toHaveURL(/\/candidate-dashboard$/);
    await expect(page.locator('h1')).toContainText('Bem-vindo'); // título dinâmico
  });

  test('Deve acessar a seção de matches de vagas através do menu', async ({ page }) => {
    // Abre o menu lateral
    await page.locator('header button').first().click();

    // Clica na opção de "Matches"
    await page.getByRole('link', { name: 'Meus Matches' }).click();

    // Verifica se estamos na página de matches
    await expect(page).toHaveURL(/\/matches-candidate$/);

    // Verifica se há matches
    const matches = page.locator('.match-card');
    const matchCount = await matches.count();

    if (matchCount > 0) {
      await expect(matches.first()).toBeVisible();
    } else {
      console.log('Nenhum match disponível no momento.');
    }
  });

  test('Botão de logout deve funcionar', async ({ page }) => {
    await page.locator('header button').first().click(); // abre o menu
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/auth$/);
  });

});