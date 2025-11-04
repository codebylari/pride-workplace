import { test, expect } from '@playwright/test';

test.describe('Dashboard Empresa', () => {
  test.beforeEach(async ({ page }) => {
    // Login da empresa
    await page.goto('/login');
    await page.getByLabel('Email').fill('empresa@teste.com');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard-empresa$/);
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

  test('Cadastrar nova vaga funciona', async ({ page }) => {
    await page.getByRole('button', { name: 'Cadastrar Vaga' }).click();
    await expect(page).toHaveURL(`${baseURL}/cadastro-vaga`);
    // Aqui você pode adicionar testes de preenchimento do formulário, se quiser
  });

  test('Menu e logout funcionam', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('link', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
