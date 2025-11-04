import { test, expect } from '@playwright/test';

test.describe('EditCandidateProfile', () => {

  test.beforeEach(async ({ page }) => {
    // Supondo que você precise estar logada como candidato
    await page.goto('http://localhost:3000/login'); // ajuste para sua URL
    await page.fill('input[name="email"]', 'candidato@example.com');
    await page.fill('input[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // Navegar para a página de edição
    await page.goto('http://localhost:3000/edit-candidate-profile');
  });

  test('Deve carregar todos os campos do formulário', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="bio"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Deve atualizar o perfil do candidato com sucesso', async ({ page }) => {
    await page.fill('input[name="name"]', 'Larissa Soeiro');
    await page.fill('input[name="email"]', 'larissa@example.com');
    await page.fill('textarea[name="bio"]', 'Sou desenvolvedora e amo gatos.');

    await page.click('button[type="submit"]');

    // Verificar se mensagem de sucesso aparece
    await expect(page.locator('text=Perfil atualizado com sucesso')).toBeVisible();
  });

});
