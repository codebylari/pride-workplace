import { test, expect } from '@playwright/test';

test.describe('Dashboard Empresa', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa diretamente o dashboard da empresa (sem login)
    await page.goto('/company-dashboard');
  });

  test('Deve exibir botão de cadastrar vaga', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Cadastrar Vaga' })).toBeVisible();
  });

  test('Deve exibir vagas existentes', async ({ page }) => {
    const vagas = page.locator('.vaga-card'); // supondo que cada vaga tenha a classe vaga-card
    await expect(vagas).toHaveCountGreaterThan(0);
  });

  test('Deve permitir clicar em uma vaga e ver candidatos', async ({ page }) => {
    const primeiraVaga = page.locator('.vaga-card').first();
    await primeiraVaga.click();
    await expect(page.getByRole('button', { name: 'Ver Candidatos' })).toBeVisible();
    await page.getByRole('button', { name: 'Ver Candidatos' }).click();
    await expect(page.locator('.candidato-card')).toHaveCountGreaterThan(0); // verifica candidatos
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
