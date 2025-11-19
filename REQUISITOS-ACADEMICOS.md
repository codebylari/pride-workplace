# ✅ VERIFICAÇÃO DE REQUISITOS ACADÊMICOS
## Projeto Linka+ - Banco de Dados

---

## 📋 CHECKLIST DE REQUISITOS

### ✅ 1. Script do Banco de Dados (Modelo Relacional)
**Arquivo:** `database-academic-script.sql`

**Status:** ✅ COMPLETO

O script contém a definição completa de 11 tabelas relacionais:
- papeis_usuarios
- perfis_candidatos
- perfis_empresas
- vagas
- candidaturas
- deslizes
- correspondencias
- avaliacoes
- notificacoes
- depoimentos
- logs_admin

---

### ✅ 2. Criação de pelo menos 02 (duas) tabelas
**Status:** ✅ COMPLETO (11 tabelas criadas)

**Principais tabelas:**
1. **perfis_candidatos** (linhas 28-47)
2. **perfis_empresas** (linhas 49-67)
3. **vagas** (linhas 69-83)
4. **candidaturas** (linhas 85-100)
5. E mais 7 tabelas adicionais

---

### ✅ 3. Chave Estrangeira (pelo menos 01 relacionamento)
**Status:** ✅ COMPLETO (14 chaves estrangeiras)

**Exemplos de Foreign Keys:**

```sql
-- perfis_candidatos → papeis_usuarios
FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE

-- candidaturas → perfis_candidatos + vagas
FOREIGN KEY (candidato_id) REFERENCES perfis_candidatos(id_candidato) ON DELETE CASCADE
FOREIGN KEY (vaga_id) REFERENCES vagas(id_vaga) ON DELETE CASCADE

-- avaliacoes → papeis_usuarios + candidaturas
FOREIGN KEY (avaliador_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
FOREIGN KEY (candidatura_id) REFERENCES candidaturas(id_candidatura) ON DELETE CASCADE
```

---

### ✅ 4. REGRA: Campo numérico como chave primária
**Status:** ✅ COMPLETO

**Todas as tabelas possuem PK numérica do tipo SERIAL:**

| Tabela | Chave Primária | Tipo |
|--------|---------------|------|
| papeis_usuarios | id_papel | SERIAL |
| perfis_candidatos | id_candidato | SERIAL |
| perfis_empresas | id_empresa | SERIAL |
| vagas | id_vaga | SERIAL |
| candidaturas | id_candidatura | SERIAL |
| deslizes | id_deslize | SERIAL |
| correspondencias | id_correspondencia | SERIAL |
| avaliacoes | id_avaliacao | SERIAL |
| notificacoes | id_notificacao | SERIAL |
| depoimentos | id_depoimento | SERIAL |
| logs_admin | id_log | SERIAL |

**SERIAL** é um tipo auto-incrementável do PostgreSQL que gera números inteiros sequenciais automaticamente.

---

### ✅ 5. REGRA: Pelo menos 02 atributos por tabela
**Status:** ✅ COMPLETO

**Exemplo - tabela perfis_candidatos (14 atributos):**
- id_candidato (PK)
- user_id (FK)
- nome_completo
- nome_social
- cidade
- estado
- nivel_experiencia
- area_trabalho
- linkedin_url
- sobre_mim
- avaliacao
- total_avaliacoes
- esta_ativo
- data_criacao

**Todas as tabelas têm no mínimo 4 atributos.**

---

### ✅ 6. Criação de uma Função
**Status:** ✅ COMPLETO (2 funções criadas)

#### Função 1: atualizar_avaliacao_candidato
**Linhas:** 193-213

```sql
CREATE OR REPLACE FUNCTION atualizar_avaliacao_candidato(p_candidato_id INTEGER)
RETURNS VOID AS $$
DECLARE
    media_nota DECIMAL(2,1);
    total_count INTEGER;
BEGIN
    -- Calcula a média das avaliações
    SELECT 
        ROUND(AVG(nota)::numeric, 1),
        COUNT(*)
    INTO media_nota, total_count
    FROM avaliacoes
    WHERE avaliado_id = p_candidato_id;
    
    -- Atualiza o perfil do candidato
    UPDATE perfis_candidatos
    SET 
        avaliacao = COALESCE(media_nota, 5.0),
        total_avaliacoes = total_count
    WHERE id_candidato = p_candidato_id;
END;
$$ LANGUAGE plpgsql;
```

**Descrição:** Calcula e atualiza automaticamente a média de avaliações de um candidato.

#### Função 2: atualizar_avaliacao_empresa
**Linhas:** 215-235

**Descrição:** Calcula e atualiza automaticamente a média de avaliações de uma empresa.

---

### ✅ 7. Trigger executada na inserção
**Status:** ✅ COMPLETO (2 triggers criadas)

#### Trigger 1: avaliacao_inserida
**Linhas:** 241-262

```sql
CREATE OR REPLACE FUNCTION trigger_atualizar_avaliacao()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o avaliado é candidato ou empresa
    IF EXISTS (SELECT 1 FROM perfis_candidatos WHERE id_candidato = NEW.avaliado_id) THEN
        PERFORM atualizar_avaliacao_candidato(NEW.avaliado_id);
    ELSIF EXISTS (SELECT 1 FROM perfis_empresas WHERE user_id = NEW.avaliado_id) THEN
        PERFORM atualizar_avaliacao_empresa(NEW.avaliado_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER avaliacao_inserida
AFTER INSERT ON avaliacoes
FOR EACH ROW
EXECUTE FUNCTION trigger_atualizar_avaliacao();
```

**Descrição:** Dispara automaticamente quando uma nova avaliação é inserida na tabela `avaliacoes`, atualizando a média de avaliações do candidato ou empresa avaliado.

#### Trigger 2: candidatura_criada
**Linhas:** 264-289

**Descrição:** Cria automaticamente uma notificação para a empresa quando um candidato se candidata a uma vaga.

---

### ✅ 8. Stored Procedure/Function/View com JOIN
**Status:** ✅ COMPLETO (1 View + 2 Stored Procedures com JOIN)

#### View: view_candidaturas_completas
**Linhas:** 295-330

```sql
CREATE OR REPLACE VIEW view_candidaturas_completas AS
SELECT 
    c.id_candidatura,
    c.status,
    -- Dados do candidato
    pc.nome_completo AS nome_candidato,
    -- Dados da vaga
    v.titulo AS titulo_vaga,
    -- Dados da empresa
    pe.nome_fantasia AS nome_empresa
FROM candidaturas c
INNER JOIN perfis_candidatos pc ON c.candidato_id = pc.id_candidato
INNER JOIN vagas v ON c.vaga_id = v.id_vaga
INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id;
```

**Descrição:** View que faz JOIN entre 4 tabelas (candidaturas, perfis_candidatos, vagas, perfis_empresas) para exibir informações completas das candidaturas.

#### Stored Procedure 1: buscar_candidatos_qualificados
**Linhas:** 332-358

```sql
CREATE OR REPLACE FUNCTION buscar_candidatos_qualificados(p_vaga_id INTEGER)
RETURNS TABLE (...) AS $$
BEGIN
    RETURN QUERY
    SELECT pc.*
    FROM perfis_candidatos pc
    INNER JOIN vagas v ON v.id_vaga = p_vaga_id
    LEFT JOIN candidaturas c ON c.candidato_id = pc.id_candidato
    WHERE pc.esta_ativo = TRUE
    ORDER BY pc.avaliacao DESC;
END;
$$ LANGUAGE plpgsql;
```

**Descrição:** Busca candidatos qualificados usando JOIN entre perfis_candidatos, vagas e candidaturas.

#### Stored Procedure 2: relatorio_vagas_empresa
**Linhas:** 360-388

**Descrição:** Gera relatório de vagas usando JOIN e agregações (COUNT) entre vagas e candidaturas.

---

### ✅ 9. Inserção de pelo menos 5 registros em cada tabela
**Status:** ✅ COMPLETO

**Quantidade de registros inseridos por tabela:**

| Tabela | Quantidade | Linhas |
|--------|-----------|--------|
| papeis_usuarios | 11 registros | 394-404 |
| perfis_candidatos | 5 registros | 407-411 |
| perfis_empresas | 5 registros | 414-418 |
| vagas | 6 registros | 421-426 |
| candidaturas | 8 registros | 429-436 |
| deslizes | 7 registros | 439-445 |
| correspondencias | 5 registros | 448-452 |
| avaliacoes | 5 registros | 455-459 |
| notificacoes | 5 registros | 462-466 |
| depoimentos | 5 registros | 469-473 |
| logs_admin | 5 registros | 476-480 |

**TODAS as tabelas possuem 5 ou mais registros inseridos!**

---

## 📊 RESUMO FINAL

| Requisito | Status | Qtd. Entregue | Mínimo Exigido |
|-----------|--------|---------------|----------------|
| Tabelas criadas | ✅ | 11 | 2 |
| Chaves estrangeiras | ✅ | 14 | 1 |
| PKs numéricas (SERIAL) | ✅ | 11 | Todas |
| Atributos por tabela | ✅ | 4-14 | 2 |
| Funções | ✅ | 2 | 1 |
| Triggers | ✅ | 2 | 1 |
| Procedures com JOIN | ✅ | 3 | 1 |
| Registros por tabela | ✅ | 5-11 | 5 |

---

## 🎯 CONCLUSÃO

O script `database-academic-script.sql` atende **COMPLETAMENTE** todos os requisitos acadêmicos solicitados:

✅ Script completo do banco de dados relacional  
✅ 11 tabelas criadas (exige: 2)  
✅ 14 chaves estrangeiras (exige: 1)  
✅ Todas PKs numéricas (SERIAL)  
✅ Todas tabelas com 2+ atributos  
✅ 2 funções criadas (exige: 1)  
✅ 2 triggers criadas (exige: 1)  
✅ 3 procedures/views com JOIN (exige: 1)  
✅ 5+ registros em cada tabela (exige: 5)  

**O projeto EXCEDE as expectativas acadêmicas em todos os critérios!**

---

## 📁 ARQUIVOS DO PROJETO

1. **database-academic-script.sql** - Script acadêmico completo com PKs numéricas
2. **database-complete-schema.sql** - Schema de produção (com UUIDs e 39 tabelas)
3. **database-er-diagram.svg** - Diagrama entidade-relacionamento

---

## 🚀 COMO EXECUTAR

```bash
# 1. Criar o banco de dados
psql -U postgres -c "CREATE DATABASE linkar_db;"

# 2. Executar o script acadêmico
psql -U postgres -d linkar_db -f database-academic-script.sql

# 3. Verificar as tabelas
psql -U postgres -d linkar_db -c "\dt"

# 4. Testar as procedures
psql -U postgres -d linkar_db -c "SELECT * FROM buscar_candidatos_qualificados(1);"
psql -U postgres -d linkar_db -c "SELECT * FROM relatorio_vagas_empresa(2001);"
psql -U postgres -d linkar_db -c "SELECT * FROM view_candidaturas_completas;"
```

---

**Documento gerado para validação acadêmica do Projeto Linka+**  
**Data:** 18/11/2025