import { test, expect } from '@playwright/test';

test.describe('Auth Page - Login', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('Deve exibir todos os campos e botões', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Esqueceu sua senha?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'CADASTRAR-SE' })).toBeVisible();
  });

  test('Não deve permitir login com campos vazios', async ({ page }) => {
    // HTML5 validation prevents form submission with required fields empty
    // Just verify the form has required fields
    await expect(page.locator('input[type="email"]')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('••••••••••')).toHaveAttribute('required', '');
  });

  test('Não deve permitir login com credenciais inválidas', async ({ page }) => {
    await page.getByPlaceholder('seu@email.com').fill('usuario@errado.com');
    await page.getByPlaceholder('••••••••••').fill('senhaerrada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Erro no login')).toBeVisible();
  });

  test('Deve permitir login com credenciais válidas', async ({ page }) => {
    await page.getByPlaceholder('seu@email.com').fill('usuario@teste.com');
    await page.getByPlaceholder('••••••••••').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();
    // Verifica se redirecionou para dashboard (company ou candidate)
    await expect(page).toHaveURL(/\/(company|candidate)-dashboard$/);
  });

  test('Link de "Esqueceu a senha?" funciona', async ({ page }) => {
    await page.getByRole('button', { name: 'Esqueceu sua senha?' }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test('Botão de "Cadastrar" funciona', async ({ page }) => {
    await page.getByRole('button', { name: 'CADASTRAR-SE' }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

});
