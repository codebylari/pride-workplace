import { test, expect } from '@playwright/test';

// Função auxiliar para preencher perguntas do candidato
async function responderPerguntasCandidato(page: any) {
  await page.check('input[name="pergunta1"][value="sim"]');
  await page.check('input[name="pergunta2"][value="não"]');
  // Adicione outras perguntas aqui
}

// Função auxiliar para preencher perguntas da empresa
async function responderPerguntasEmpresa(page: any) {
  await page.check('input[name="pergunta1"][value="sim"]');
  await page.check('input[name="pergunta2"][value="não"]');
  // Adicione outras perguntas aqui
}

test.describe('Cadastro de Candidato', () => {

  test('cadastro com sucesso', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Seleciona fluxo candidato
    await page.click('button#candidato');

    // Preenche campos básicos
    await page.fill('input[name="name"]', 'Larissa Teste');
    await page.fill('input[name="email"]', 'larissa@teste.com');
    await page.fill('input[name="password"]', '123456');

    // Responde perguntas do candidato
    await responderPerguntasCandidato(page);

    // Submete o formulário
    await page.click('button[type="submit"]');

    // Verifica mensagem de sucesso
    await expect(page.locator('.success-message')).toHaveText(/Cadastro realizado com sucesso/);
  });

  test('validação: campos obrigatórios', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.click('button#candidato');

    // Não preenche nada e tenta submeter
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toHaveText(/Campo obrigatório/);
  });

  test('validação: email inválido', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.click('button#candidato');

    await page.fill('input[name="email"]', 'emailinvalido');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toHaveText(/Email inválido/);
  });
});

test.describe('Cadastro de Empresa', () => {

  test('cadastro com sucesso', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Seleciona fluxo empresa
    await page.click('button#empresa');

    // Preenche campos da empresa
    await page.fill('input[name="nomeEmpresa"]', 'Empresa Teste');
    await page.fill('input[name="email"]', 'empresa@teste.com');
    await page.fill('input[name="senha"]', '123456');

    // Responde perguntas da empresa
    await responderPerguntasEmpresa(page);

    // Submete o formulário
    await page.click('button[type="submit"]');

    // Verifica mensagem de sucesso
    await expect(page.locator('.success-message')).toHaveText(/Cadastro realizado com sucesso/);
  });

  test('validação: campos obrigatórios', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.click('button#empresa');

    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toHaveText(/Campo obrigatório/);
  });

  test('validação: email inválido', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.click('button#empresa');

    await page.fill('input[name="email"]', 'emailinvalido');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toHaveText(/Email inválido/);
  });
});
