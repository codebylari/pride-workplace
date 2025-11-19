-- ============================================
-- PROJETO LINKA+ - BANCO DE DADOS
-- REQUISITO: CRIAÇÃO DE FUNÇÕES
-- ============================================
-- Aluno: [SEU NOME]
-- Disciplina: Banco de Dados
-- ============================================

-- ============================================
-- FUNÇÃO 1: atualizar_avaliacao_candidato
-- ============================================
-- Descrição: Calcula e atualiza a média de avaliações de um candidato
-- Parâmetro: p_candidato_id (INTEGER) - ID do candidato
-- Retorno: VOID (não retorna valor)
-- Uso: Chamada automaticamente por trigger ou manualmente

CREATE OR REPLACE FUNCTION atualizar_avaliacao_candidato(p_candidato_id INTEGER)
RETURNS VOID AS $$
DECLARE
    media_nota DECIMAL(2,1);      -- Variável para armazenar média
    total_count INTEGER;          -- Variável para contar avaliações
BEGIN
    -- Calcula a média das notas e conta total de avaliações
    SELECT 
        ROUND(AVG(nota)::numeric, 1),
        COUNT(*)
    INTO media_nota, total_count
    FROM avaliacoes
    WHERE avaliado_id = p_candidato_id;
    
    -- Atualiza o perfil do candidato com os novos valores
    UPDATE perfis_candidatos
    SET 
        avaliacao = COALESCE(media_nota, 5.0),  -- Se NULL, usa 5.0
        total_avaliacoes = total_count
    WHERE id_candidato = p_candidato_id;
    
    -- Mensagem de log (opcional)
    RAISE NOTICE 'Candidato % atualizado: média=%, total=%', 
                 p_candidato_id, COALESCE(media_nota, 5.0), total_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNÇÃO 2: atualizar_avaliacao_empresa
-- ============================================
-- Descrição: Calcula e atualiza a média de avaliações de uma empresa
-- Parâmetro: p_empresa_id (INTEGER) - ID da empresa (user_id)
-- Retorno: VOID (não retorna valor)
-- Uso: Chamada automaticamente por trigger ou manualmente

CREATE OR REPLACE FUNCTION atualizar_avaliacao_empresa(p_empresa_id INTEGER)
RETURNS VOID AS $$
DECLARE
    media_nota DECIMAL(2,1);      -- Variável para armazenar média
    total_count INTEGER;          -- Variável para contar avaliações
BEGIN
    -- Calcula a média das notas e conta total de avaliações
    SELECT 
        ROUND(AVG(nota)::numeric, 1),
        COUNT(*)
    INTO media_nota, total_count
    FROM avaliacoes
    WHERE avaliado_id = p_empresa_id;
    
    -- Atualiza o perfil da empresa com os novos valores
    UPDATE perfis_empresas
    SET 
        avaliacao = COALESCE(media_nota, 5.0),  -- Se NULL, usa 5.0
        total_avaliacoes = total_count
    WHERE user_id = p_empresa_id;
    
    -- Mensagem de log (opcional)
    RAISE NOTICE 'Empresa % atualizada: média=%, total=%', 
                 p_empresa_id, COALESCE(media_nota, 5.0), total_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- EXEMPLOS DE USO DAS FUNÇÕES
-- ============================================

-- Exemplo 1: Atualizar avaliação de um candidato específico
-- SELECT atualizar_avaliacao_candidato(1);

-- Exemplo 2: Atualizar avaliação de uma empresa específica
-- SELECT atualizar_avaliacao_empresa(2001);

-- Exemplo 3: Atualizar todos os candidatos (loop)
-- DO $$
-- DECLARE
--     candidato RECORD;
-- BEGIN
--     FOR candidato IN SELECT id_candidato FROM perfis_candidatos LOOP
--         PERFORM atualizar_avaliacao_candidato(candidato.id_candidato);
--     END LOOP;
-- END $$;

-- ============================================
-- VERIFICAÇÃO DOS REQUISITOS
-- ============================================

-- ✅ REQUISITO: Criação de pelo menos 1 função
--    → Criadas 2 funções:
--      1. atualizar_avaliacao_candidato
--      2. atualizar_avaliacao_empresa
--
--    Ambas funções:
--    - Usam DECLARE para variáveis
--    - Executam consultas SQL (SELECT)
--    - Realizam cálculos (AVG, COUNT)
--    - Atualizam dados (UPDATE)
--    - Retornam void
--    - Escritas em PL/pgSQL

-- ============================================
-- FIM DO ARQUIVO
-- ============================================