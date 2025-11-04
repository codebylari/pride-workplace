import { test, expect } from '@playwright/test';

test.describe('Dashboard do Candidato', () => {

  test('Botão de logout deve funcionar', async ({ page }) => {
   

    // Espera o botão do menu aparecer e estar visível
    const menuButton = page.locator('header button').first();
    await menuButton.waitFor({ state: 'visible', timeout: 10000 }); // espera até 10s
    await menuButton.click();

    // Espera o botão "Sair" aparecer e clica
    const logoutButton = page.getByRole('button', { name: 'Sair' });
    await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await logoutButton.click();

    // Espera a URL mudar para a raiz ou /login
    await expect(page).toHaveURL('http://localhost:8080/');

    // Opcional: verificar se o dashboard desapareceu após logout
    await expect(page.locator('h1')).toHaveCount(0);
  });

});