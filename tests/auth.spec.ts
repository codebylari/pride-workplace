import { test, expect } from '@playwright/test';

test.describe('Auth Page - Login', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Deve exibir todos os campos e botões', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Esqueceu a senha?' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cadastrar' })).toBeVisible();
  });

  test('Não deve permitir login com campos vazios', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Email é obrigatório')).toBeVisible();
    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });

  test('Não deve permitir login com credenciais inválidas', async ({ page }) => {
    await page.getByLabel('Email').fill('usuario@errado.com');
    await page.getByLabel('Senha').fill('senhaerrada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Email ou senha incorretos')).toBeVisible();
  });

  test('Deve permitir login com credenciais válidas', async ({ page }) => {
    await page.getByLabel('Email').fill('usuario@teste.com');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();
    // Verifica se redirecionou para dashboard
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('Link de "Esqueceu a senha?" funciona', async ({ page }) => {
    await page.getByRole('link', { name: 'Esqueceu a senha?' }).click();
    await expect(page).toHaveURL(/\/reset-password$/);
  });

  test('Link de "Cadastrar" funciona', async ({ page }) => {
    await page.getByRole('link', { name: 'Cadastrar' }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

});
