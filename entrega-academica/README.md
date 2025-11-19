# 📚 ENTREGA ACADÊMICA - PROJETO LINKA+
## Banco de Dados - Trabalho Prático

---

## 👨‍🎓 INFORMAÇÕES DO TRABALHO

**Aluno:** [SEU NOME AQUI]  
**Curso:** [SEU CURSO]  
**Disciplina:** Banco de Dados  
**Professor:** [NOME DO PROFESSOR]  
**Data:** Novembro/2025

---

## 📋 ESTRUTURA DA ENTREGA

Este projeto está organizado em 5 arquivos SQL, cada um correspondendo a um requisito específico:

```
entrega-academica/
├── 01-criacao-tabelas.sql      ✅ Criação de tabelas e chaves estrangeiras
├── 02-funcoes.sql              ✅ Criação de funções (functions)
├── 03-triggers.sql             ✅ Criação de triggers para INSERT
├── 04-procedures-joins.sql     ✅ Stored procedures e views com JOIN
├── 05-insercao-dados.sql       ✅ Inserção de 5+ registros por tabela
└── README.md                   📖 Este arquivo
```

---

## ✅ CHECKLIST DE REQUISITOS ATENDIDOS

### 📌 Requisito 1: Script do Banco de Dados
**Arquivo:** `01-criacao-tabelas.sql`  
**Status:** ✅ COMPLETO

- Criação do banco de dados `linkar_db`
- Modelo relacional completo
- 5 tabelas principais criadas

---

### 📌 Requisito 2: Pelo menos 2 tabelas criadas
**Arquivo:** `01-criacao-tabelas.sql`  
**Status:** ✅ COMPLETO (5 tabelas)

**Tabelas criadas:**
1. `papeis_usuarios` (user roles)
2. `perfis_candidatos` (candidate profiles)
3. `perfis_empresas` (company profiles)
4. `vagas` (job postings)
5. `candidaturas` (job applications)

---

### 📌 Requisito 3: Pelo menos 1 chave estrangeira
**Arquivo:** `01-criacao-tabelas.sql`  
**Status:** ✅ COMPLETO (5 chaves estrangeiras)

**Relacionamentos criados:**
- `perfis_candidatos.user_id` → `papeis_usuarios.user_id`
- `perfis_empresas.user_id` → `papeis_usuarios.user_id`
- `vagas.empresa_id` → `papeis_usuarios.user_id`
- `candidaturas.candidato_id` → `perfis_candidatos.id_candidato`
- `candidaturas.vaga_id` → `vagas.id_vaga`

---

### 📌 REGRA: Chave primária numérica
**Arquivo:** `01-criacao-tabelas.sql`  
**Status:** ✅ COMPLETO

**Todas as tabelas possuem PK do tipo SERIAL (auto-incrementável):**
- `id_papel` (papeis_usuarios)
- `id_candidato` (perfis_candidatos)
- `id_empresa` (perfis_empresas)
- `id_vaga` (vagas)
- `id_candidatura` (candidaturas)

---

### 📌 REGRA: Pelo menos 2 atributos por tabela
**Arquivo:** `01-criacao-tabelas.sql`  
**Status:** ✅ COMPLETO

**Todas as tabelas possuem mais de 2 atributos:**
- papeis_usuarios: 4 atributos
- perfis_candidatos: 14 atributos
- perfis_empresas: 13 atributos
- vagas: 10 atributos
- candidaturas: 9 atributos

---

### 📌 Requisito 4: Criação de 1 função
**Arquivo:** `02-funcoes.sql`  
**Status:** ✅ COMPLETO (2 funções)

**Funções criadas:**
1. `atualizar_avaliacao_candidato(p_candidato_id INTEGER)`
   - Calcula e atualiza média de avaliações
   - Usa DECLARE, SELECT, UPDATE

2. `atualizar_avaliacao_empresa(p_empresa_id INTEGER)`
   - Calcula e atualiza média de avaliações da empresa
   - Usa DECLARE, SELECT, UPDATE

---

### 📌 Requisito 5: Trigger na inserção
**Arquivo:** `03-triggers.sql`  
**Status:** ✅ COMPLETO (2 triggers)

**Triggers criados:**
1. `avaliacao_inserida`
   - Dispara APÓS INSERT em `avaliacoes`
   - Atualiza automaticamente a média de avaliações

2. `candidatura_criada`
   - Dispara APÓS INSERT em `candidaturas`
   - Cria notificação automática para a empresa

---

### 📌 Requisito 6: Procedure/Function/View com JOIN
**Arquivo:** `04-procedures-joins.sql`  
**Status:** ✅ COMPLETO (1 view + 3 procedures)

**Implementações:**
1. **VIEW:** `view_candidaturas_completas`
   - 3 INNER JOINs
   - Combina 4 tabelas

2. **FUNCTION:** `buscar_candidatos_qualificados(p_vaga_id)`
   - INNER JOIN + LEFT JOIN
   - Retorna TABLE de candidatos

3. **FUNCTION:** `relatorio_vagas_empresa(p_empresa_id)`
   - LEFT JOIN + GROUP BY
   - Agregações com COUNT/CASE

4. **FUNCTION:** `historico_candidato(p_candidato_id)`
   - 2 INNER JOINs
   - Histórico completo de candidaturas

---

### 📌 Requisito 7: Inserção de 5 registros por tabela
**Arquivo:** `05-insercao-dados.sql`  
**Status:** ✅ COMPLETO

**Registros inseridos:**
- papeis_usuarios: **11 registros** ✅
- perfis_candidatos: **5 registros** ✅
- perfis_empresas: **5 registros** ✅
- vagas: **6 registros** ✅
- candidaturas: **8 registros** ✅
- avaliacoes: **5 registros** ✅
- notificacoes: **5 registros** ✅
- depoimentos: **5 registros** ✅

---

## 🚀 COMO EXECUTAR

### Pré-requisitos
- PostgreSQL instalado (versão 12 ou superior)
- Acesso ao terminal ou cliente SQL (pgAdmin, DBeaver, etc.)

### Passo a Passo

```bash
# 1. Criar o banco de dados
psql -U postgres -c "CREATE DATABASE linkar_db;"

# 2. Executar os scripts na ordem
psql -U postgres -d linkar_db -f 01-criacao-tabelas.sql
psql -U postgres -d linkar_db -f 02-funcoes.sql
psql -U postgres -d linkar_db -f 03-triggers.sql
psql -U postgres -d linkar_db -f 04-procedures-joins.sql
psql -U postgres -d linkar_db -f 05-insercao-dados.sql
```

### Verificação

```bash
# Listar tabelas criadas
psql -U postgres -d linkar_db -c "\dt"

# Verificar funções
psql -U postgres -d linkar_db -c "\df"

# Verificar triggers
psql -U postgres -d linkar_db -c "SELECT * FROM pg_trigger;"

# Contar registros
psql -U postgres -d linkar_db -c "SELECT 'papeis_usuarios' as tabela, COUNT(*) FROM papeis_usuarios;"
```

---

## 📊 EXEMPLOS DE CONSULTAS

### Usar a VIEW
```sql
-- Ver todas as candidaturas completas
SELECT * FROM view_candidaturas_completas;

-- Filtrar candidaturas pendentes
SELECT nome_candidato, titulo_vaga, nome_empresa 
FROM view_candidaturas_completas 
WHERE status_candidatura = 'pending';
```

### Usar as PROCEDURES
```sql
-- Buscar candidatos qualificados para uma vaga
SELECT * FROM buscar_candidatos_qualificados(1);

-- Relatório de vagas de uma empresa
SELECT * FROM relatorio_vagas_empresa(2001);

-- Histórico de candidaturas de um candidato
SELECT * FROM historico_candidato(1);
```

### Testar TRIGGERS
```sql
-- Inserir uma nova avaliação (dispara trigger)
INSERT INTO avaliacoes (avaliador_id, avaliado_id, candidatura_id, nota, comentario)
VALUES (2001, 1002, 1, 4.5, 'Excelente profissional!');

-- Verificar se a média foi atualizada
SELECT avaliacao, total_avaliacoes FROM perfis_candidatos WHERE id_candidato = 1;
```

### Testar FUNÇÕES
```sql
-- Atualizar avaliação manualmente
SELECT atualizar_avaliacao_candidato(1);
SELECT atualizar_avaliacao_empresa(2001);
```

---

## 📁 ARQUIVOS ADICIONAIS DO PROJETO

Além desta entrega acadêmica, o projeto completo possui:

- `database-complete-schema.sql` - Schema de produção com 39 tabelas
- `database-er-diagram.svg` - Diagrama entidade-relacionamento
- `REQUISITOS-ACADEMICOS.md` - Documentação completa dos requisitos

---

## 🎯 RESUMO FINAL

| Requisito | Exigido | Entregue | Status |
|-----------|---------|----------|--------|
| Tabelas | 2 | 5 | ✅ |
| Chaves Estrangeiras | 1 | 5 | ✅ |
| PK Numérica | Todas | Todas | ✅ |
| Atributos por Tabela | 2+ | 4-14 | ✅ |
| Funções | 1 | 2 | ✅ |
| Triggers | 1 | 2 | ✅ |
| Procedures com JOIN | 1 | 4 | ✅ |
| Registros por Tabela | 5+ | 5-11 | ✅ |

**✅ TODOS OS REQUISITOS FORAM ATENDIDOS E SUPERADOS!**

---

## 🔍 OBSERVAÇÕES

1. **Organização:** Cada requisito está em um arquivo separado para facilitar a correção
2. **Comentários:** Todos os arquivos possuem comentários explicativos
3. **Exemplos:** Cada arquivo inclui exemplos de uso
4. **Verificação:** Queries de verificação ao final de cada arquivo
5. **Dados Realistas:** Dados de exemplo são realistas e coerentes

---

## 📞 CONTATO

**Aluno:** [SEU NOME]  
**Email:** [SEU EMAIL]  
**GitHub:** [SEU GITHUB (opcional)]

---

## 📝 NOTAS PARA O PROFESSOR

- Todos os scripts foram testados no PostgreSQL 14
- A ordem de execução dos arquivos é importante
- Os triggers funcionam automaticamente após a criação
- As procedures podem ser testadas com os dados de exemplo
- Cada arquivo é independente e documentado

---

**📅 Entrega realizada em:** [DATA DA ENTREGA]  
**✅ Status:** Todos os requisitos atendidos

---

## 🙏 AGRADECIMENTOS

Agradeço ao professor [NOME DO PROFESSOR] pelos ensinamentos durante o semestre e pela oportunidade de desenvolver este projeto prático de banco de dados.

---

**Feito com dedicação para a disciplina de Banco de Dados 🎓**