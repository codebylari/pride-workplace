# Testes de Carga com Locust - LinKar

## 📋 Pré-requisitos

- Python 3.8+
- pip

## 🚀 Instalação

```bash
# Instalar dependências
pip install -r requirements-locust.txt
```

## 🎯 Executar Testes

### 1. Modo Interface Web (Recomendado)

```bash
# Usar configuração padrão
locust -f locustfile.py

# Ou especificar manualmente
locust -f locustfile.py --host=https://nvtgmcqromdzmrapbkrg.supabase.co
```

Acesse: http://localhost:8089

Configure:
- **Number of users**: 100 (usuários simultâneos)
- **Spawn rate**: 10 (usuários/segundo)
- **Host**: https://nvtgmcqromdzmrapbkrg.supabase.co

### 2. Modo Headless (Sem Interface)

```bash
# Teste rápido (1 minuto)
locust -f locustfile.py --headless -u 50 -r 5 -t 1m --html report.html

# Teste médio (5 minutos)
locust -f locustfile.py --headless -u 100 -r 10 -t 5m --html report.html

# Teste longo (15 minutos)
locust -f locustfile.py --headless -u 200 -r 20 -t 15m --html report.html --csv stats
```

Parâmetros:
- `-u`: Número de usuários simultâneos
- `-r`: Taxa de spawn (usuários por segundo)
- `-t`: Duração do teste
- `--html`: Gerar relatório HTML
- `--csv`: Gerar estatísticas CSV

### 3. Testar Cenários Específicos

```bash
# Apenas candidatos
locust -f locustfile.py --headless -u 100 -r 10 -t 5m CandidateUser

# Apenas empresas
locust -f locustfile.py --headless -u 50 -r 5 -t 5m CompanyUser

# Apenas autenticação
locust -f locustfile.py --headless -u 20 -r 2 -t 3m AuthUser

# Apenas notificações
locust -f locustfile.py --headless -u 80 -r 8 -t 5m NotificationUser
```

## 📊 Cenários de Teste

### CandidateUser (Candidatos)
- ✅ Listar vagas (3x)
- ✅ Ver detalhes de vaga (2x)
- ✅ Buscar vagas (1x)
- ✅ Listar perfis (1x)

### CompanyUser (Empresas)
- ✅ Listar candidatos (3x)
- ✅ Ver vagas da empresa (2x)
- ✅ Ver candidaturas (1x)
- ✅ Ver matches (1x)

### AuthUser (Autenticação)
- ✅ Registro de candidato (1x)
- ✅ Registro de empresa (1x)

### NotificationUser (Notificações)
- ✅ Listar notificações (5x)
- ✅ Contar não lidas (1x)

## 📈 Métricas Monitoradas

- **RPS** (Requests per Second): Requisições por segundo
- **Response Time**: Tempo de resposta (p50, p95, p99)
- **Failures**: Taxa de falhas
- **Users**: Usuários simultâneos
- **Throughput**: Volume de dados

## 🎯 Cenários Recomendados

### Teste de Fumaça (Quick)
```bash
locust -f locustfile.py --headless -u 10 -r 2 -t 1m --html smoke-test.html
```

### Teste de Carga Normal
```bash
locust -f locustfile.py --headless -u 100 -r 10 -t 5m --html load-test.html
```

### Teste de Stress
```bash
locust -f locustfile.py --headless -u 500 -r 50 -t 10m --html stress-test.html
```

### Teste de Pico (Spike)
```bash
locust -f locustfile.py --headless -u 1000 -r 100 -t 3m --html spike-test.html
```

## 📝 Análise de Resultados

Após o teste, verifique:

1. **Tempo de Resposta Médio**: Deve ser < 500ms
2. **P95 Response Time**: Deve ser < 1000ms
3. **Taxa de Erro**: Deve ser < 1%
4. **RPS Máximo**: Capacidade do sistema

## ⚠️ Avisos Importantes

1. **Não execute contra produção** sem autorização
2. **Comece com poucos usuários** e aumente gradualmente
3. **Monitore o Lovable Cloud** durante os testes
4. **Teste em horários de baixo uso** se for produção
5. **Limpe dados de teste** após os testes

## 🔧 Troubleshooting

### Erro de conexão
```bash
# Verificar conectividade
curl -I https://nvtgmcqromdzmrapbkrg.supabase.co
```

### Performance ruim
- Reduza número de usuários
- Aumente spawn rate gradualmente
- Verifique RLS policies no banco

### Rate limiting
- Adicione `wait_time` maior
- Use `between(2, 5)` em vez de `between(1, 3)`

## 📚 Recursos

- [Documentação Locust](https://docs.locust.io/)
- [Best Practices](https://docs.locust.io/en/stable/writing-a-locustfile.html)
- [Lovable Cloud Docs](https://docs.lovable.dev/)
