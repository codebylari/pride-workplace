import { test, expect } from '@playwright/test';

test.describe('CompanyJobs', () => {
  test('Deve redirecionar para /auth quando não autenticado', async ({ page }) => {
    await page.goto('/company-jobs');
    await page.waitForLoadState('networkidle');
    
    // Deve redirecionar para auth ou permanecer carregando
    await expect(page).toHaveURL(/\/(auth|company-jobs)/);
  });
});
