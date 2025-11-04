import { test, expect } from '@playwright/test';

test.describe('Registro', () => {
  test('Step 1 renderiza e PRÓXIMO começa desabilitado', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('Quem é você na nossa plataforma?')).toBeVisible();
    const proximo = page.getByRole('button', { name: 'PRÓXIMO' });
    await expect(proximo).toBeDisabled();
  });

  test('Selecionar Candidato e avançar para passo de gênero', async ({ page }) => {
    await page.goto('/register');
    await page.getByText('Sou um(a) candidato(a)').click();
    await page.getByRole('button', { name: 'PRÓXIMO' }).click();
    await expect(page.getByText('Qual é o seu gênero?')).toBeVisible();
  });

  test('Botão Voltar retorna para Auth', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: 'Voltar' }).click();
    await expect(page).toHaveURL(/\/(auth)?$/);
  });
});
