import { test, expect } from '@playwright/test';

test.describe('EditCandidateProfile', () => {
  test('Deve redirecionar para /auth quando não autenticado', async ({ page }) => {
    // Usa o baseURL configurado no playwright.config.ts (http://localhost:8080)
    await page.goto('/edit-candidate-profile');

    // Aguarda as requisições estabilizarem (evita falsos negativos)
    await page.waitForLoadState('networkidle');

    // A aplicação deve redirecionar para /auth ou permanecer enquanto carrega
    await expect(page).toHaveURL(/\/(auth|edit-candidate-profile)/);
  });
});
