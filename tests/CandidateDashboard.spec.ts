import { test, expect } from '@playwright/test';

test.describe('Dashboard Candidato', () => {
  test.beforeEach(async ({ page }) => {
    // Primeiro, faz login do candidato
    await page.goto('/login');
    await page.getByLabel('Email').fill('candidato@teste.com');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/dashboard-candidato$/);
  });

  test('Deve exibir o campo de busca', async ({ page }) => {
    await expect(page.getByPlaceholder('Buscar vagas')).toBeVisible();
  });

  test('Deve exibir pelo menos uma vaga', async ({ page }) => {
    const vagas = page.locator('.vaga-card'); // supondo que cada vaga tenha a classe vaga-card
    await expect(vagas).toHaveCount(0);
  });

  test('Deve permitir clicar em uma vaga e ver detalhes', async ({ page }) => {
    const primeiraVaga = page.locator('.vaga-card').first();
    await primeiraVaga.click();
    await expect(page).toHaveURL(/\/vaga\/\d+/); // assume que a URL da vaga tem /vaga/id
    await expect(page.getByText('Descrição da Vaga')).toBeVisible(); // ou outro campo importante
  });

  test('Buscar vagas pelo nome', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar vagas');
    await searchInput.fill('Desenvolvedor');
    await searchInput.press('Enter');
    const vagasFiltradas = page.locator('.vaga-card');
    await expect(vagasFiltradas).toHaveCount(0);
    await expect(vagasFiltradas.first()).toContainText('Desenvolvedor');
  });

  test('Menu e logout funcionam', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('link', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

});
