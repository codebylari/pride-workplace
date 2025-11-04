import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080', // URL base pro teste
    trace: 'on-first-retry',         // gera trace se falhar
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',   // URL que o servidor vai abrir
    reuseExistingServer: !process.env.CI, // reutiliza servidor se já estiver rodando
    timeout: 120000,                // tempo máximo pra subir o servidor (120s)
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
