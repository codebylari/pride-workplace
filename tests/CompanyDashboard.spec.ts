import { test, expect } from '@playwright/test';

test.describe('Dashboard Empresa', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa diretamente o dashboard da empresa (sem login)
    await page.goto('/company-dashboard');
  });

  test('Deve exibir botões principais', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Cadastre sua vaga' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Acesse suas vagas' })).toBeVisible();
  });

  test('Cadastrar nova vaga navega para create-job', async ({ page }) => {
    await page.getByRole('button', { name: 'Cadastre sua vaga' }).click();
    await expect(page).toHaveURL(/\/create-job$/);
  });

  test('Abrir menu e fazer logout', async ({ page }) => {
    // Abre o menu lateral
    await page.locator('header button').first().click();
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/(auth)?$/);
  });
});
