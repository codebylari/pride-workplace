import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
<<<<<<< Updated upstream
  testDir: './tests',
  /* Run tests in files in parallel */
=======
  testDir: './tests',  // agora está correto!
>>>>>>> Stashed changes
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
<<<<<<< Updated upstream
    baseURL: 'http://localhost:8080',
=======
>>>>>>> Stashed changes
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // demais configs...
  ],
<<<<<<< Updated upstream

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
=======
>>>>>>> Stashed changes
});
