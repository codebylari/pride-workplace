-- ============================================
-- PROJETO LINKA+ - BANCO DE DADOS
-- REQUISITO: STORED PROCEDURES E VIEWS COM JOIN
-- ============================================
-- Aluno: [SEU NOME]
-- Disciplina: Banco de Dados
-- ============================================

-- ============================================
-- VIEW 1: Candidaturas Completas (3 JOINs)
-- ============================================
-- Descrição: View que combina dados de candidaturas, candidatos, vagas e empresas
-- Tipo de JOIN: INNER JOIN (junta apenas registros que têm correspondência)
-- Tabelas envolvidas: 4 tabelas

CREATE OR REPLACE VIEW view_candidaturas_completas AS
SELECT 
    -- Dados da candidatura
    c.id_candidatura,
    c.status AS status_candidatura,
    c.aceito_candidato,
    c.data_criacao AS data_candidatura,
    
    -- Dados do candidato (JOIN 1)
    pc.id_candidato,
    pc.nome_completo AS nome_candidato,
    pc.cidade AS cidade_candidato,
    pc.estado AS estado_candidato,
    pc.nivel_experiencia,
    pc.avaliacao AS avaliacao_candidato,
    
    -- Dados da vaga (JOIN 2)
    v.id_vaga,
    v.titulo AS titulo_vaga,
    v.descricao AS descricao_vaga,
    v.salario,
    v.tipo_trabalho,
    v.remoto,
    
    -- Dados da empresa (JOIN 3)
    pe.id_empresa,
    pe.nome_fantasia AS nome_empresa,
    pe.cidade AS cidade_empresa,
    pe.estado AS estado_empresa,
    pe.setor,
    pe.avaliacao AS avaliacao_empresa

FROM candidaturas c
INNER JOIN perfis_candidatos pc ON c.candidato_id = pc.id_candidato
INNER JOIN vagas v ON c.vaga_id = v.id_vaga
INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id;

-- Exemplo de uso:
-- SELECT * FROM view_candidaturas_completas;
-- SELECT * FROM view_candidaturas_completas WHERE status_candidatura = 'pending';

-- ============================================
-- STORED PROCEDURE 1: Buscar Candidatos Qualificados
-- ============================================
-- Descrição: Busca candidatos qualificados para uma vaga usando INNER e LEFT JOIN
-- Parâmetro: p_vaga_id (INTEGER) - ID da vaga
-- Retorno: TABLE com dados dos candidatos qualificados
-- Tipo de JOIN: INNER JOIN + LEFT JOIN

CREATE OR REPLACE FUNCTION buscar_candidatos_qualificados(p_vaga_id INTEGER)
RETURNS TABLE (
    id_candidato INTEGER,
    nome_completo VARCHAR(255),
    nivel_experiencia VARCHAR(50),
    area_trabalho VARCHAR(100),
    avaliacao DECIMAL(2,1),
    cidade VARCHAR(100),
    estado VARCHAR(2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.id_candidato,
        pc.nome_completo,
        pc.nivel_experiencia,
        pc.area_trabalho,
        pc.avaliacao,
        pc.cidade,
        pc.estado
    FROM perfis_candidatos pc
    -- JOIN 1: Busca informações da vaga
    INNER JOIN vagas v ON v.id_vaga = p_vaga_id
    -- JOIN 2: Verifica se candidato já se candidatou (LEFT = traz mesmo sem candidatura)
    LEFT JOIN candidaturas c ON c.candidato_id = pc.id_candidato AND c.vaga_id = v.id_vaga
    WHERE 
        pc.esta_ativo = TRUE                    -- Candidato ativo
        AND c.id_candidatura IS NULL            -- Ainda não se candidatou
    ORDER BY pc.avaliacao DESC;                 -- Ordena por melhor avaliação
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso:
-- SELECT * FROM buscar_candidatos_qualificados(1);

-- ============================================
-- STORED PROCEDURE 2: Relatório de Vagas por Empresa
-- ============================================
-- Descrição: Gera relatório de vagas com estatísticas usando LEFT JOIN e agregações
-- Parâmetro: p_empresa_id (INTEGER) - ID da empresa (user_id)
-- Retorno: TABLE com estatísticas das vagas
-- Tipo de JOIN: LEFT JOIN + GROUP BY

CREATE OR REPLACE FUNCTION relatorio_vagas_empresa(p_empresa_id INTEGER)
RETURNS TABLE (
    id_vaga INTEGER,
    titulo_vaga VARCHAR(255),
    total_candidaturas BIGINT,
    candidaturas_pendentes BIGINT,
    candidaturas_aceitas BIGINT,
    candidaturas_rejeitadas BIGINT,
    data_criacao TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id_vaga,
        v.titulo AS titulo_vaga,
        -- Agregações: conta candidaturas por status
        COUNT(c.id_candidatura) AS total_candidaturas,
        COUNT(CASE WHEN c.status = 'pending' THEN 1 END) AS candidaturas_pendentes,
        COUNT(CASE WHEN c.status = 'accepted' THEN 1 END) AS candidaturas_aceitas,
        COUNT(CASE WHEN c.status = 'rejected' THEN 1 END) AS candidaturas_rejeitadas,
        v.data_criacao
    FROM vagas v
    -- LEFT JOIN: traz vagas mesmo sem candidaturas
    LEFT JOIN candidaturas c ON v.id_vaga = c.vaga_id
    WHERE v.empresa_id = p_empresa_id
    GROUP BY v.id_vaga, v.titulo, v.data_criacao  -- Agrupa por vaga
    ORDER BY v.data_criacao DESC;                  -- Ordena por mais recente
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso:
-- SELECT * FROM relatorio_vagas_empresa(2001);

-- ============================================
-- STORED PROCEDURE 3: Histórico de Candidato
-- ============================================
-- Descrição: Busca histórico completo de candidaturas de um candidato com JOIN
-- Parâmetro: p_candidato_id (INTEGER) - ID do candidato
-- Retorno: TABLE com histórico de candidaturas
-- Tipo de JOIN: INNER JOIN múltiplos

CREATE OR REPLACE FUNCTION historico_candidato(p_candidato_id INTEGER)
RETURNS TABLE (
    id_candidatura INTEGER,
    titulo_vaga VARCHAR(255),
    nome_empresa VARCHAR(255),
    status_candidatura VARCHAR(50),
    data_candidatura TIMESTAMP,
    salario VARCHAR(100),
    tipo_trabalho VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id_candidatura,
        v.titulo AS titulo_vaga,
        pe.nome_fantasia AS nome_empresa,
        c.status AS status_candidatura,
        c.data_criacao AS data_candidatura,
        v.salario,
        v.tipo_trabalho
    FROM candidaturas c
    -- JOIN 1: Busca dados da vaga
    INNER JOIN vagas v ON c.vaga_id = v.id_vaga
    -- JOIN 2: Busca dados da empresa
    INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id
    WHERE c.candidato_id = p_candidato_id
    ORDER BY c.data_criacao DESC;  -- Mais recentes primeiro
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso:
-- SELECT * FROM historico_candidato(1);

-- ============================================
-- EXEMPLOS DE QUERIES COM OS COMANDOS
-- ============================================

-- Exemplo 1: Ver todas as candidaturas completas
-- SELECT * FROM view_candidaturas_completas;

-- Exemplo 2: Filtrar candidaturas pendentes
-- SELECT nome_candidato, titulo_vaga, nome_empresa 
-- FROM view_candidaturas_completas 
-- WHERE status_candidatura = 'pending';

-- Exemplo 3: Buscar candidatos para vaga específica
-- SELECT * FROM buscar_candidatos_qualificados(1);

-- Exemplo 4: Relatório de vagas de uma empresa
-- SELECT * FROM relatorio_vagas_empresa(2001);

-- Exemplo 5: Ver histórico de um candidato
-- SELECT * FROM historico_candidato(1);

-- Exemplo 6: Estatísticas gerais (combinando procedures)
-- SELECT 
--     (SELECT COUNT(*) FROM view_candidaturas_completas) as total_candidaturas,
--     (SELECT COUNT(*) FROM view_candidaturas_completas WHERE status_candidatura = 'accepted') as aceitas;

-- ============================================
-- VERIFICAÇÃO DOS REQUISITOS
-- ============================================

-- ✅ REQUISITO: Stored Procedure OU Function OU View com JOIN
--    → Criadas 1 VIEW + 3 STORED PROCEDURES:
--      
--      1. VIEW: view_candidaturas_completas
--         - Usa 3 INNER JOINs
--         - Combina 4 tabelas
--         - Retorna dados completos de candidaturas
--      
--      2. FUNCTION: buscar_candidatos_qualificados
--         - Usa INNER JOIN + LEFT JOIN
--         - Filtra candidatos disponíveis
--         - Retorna TABLE de resultados
--      
--      3. FUNCTION: relatorio_vagas_empresa
--         - Usa LEFT JOIN + GROUP BY
--         - Calcula estatísticas com COUNT/CASE
--         - Retorna TABLE de resultados
--      
--      4. FUNCTION: historico_candidato
--         - Usa 2 INNER JOINs
--         - Busca histórico completo
--         - Retorna TABLE de resultados
--
--    Tipos de JOIN utilizados:
--    - INNER JOIN (retorna apenas correspondências)
--    - LEFT JOIN (retorna todos da esquerda + correspondências)
--
--    Recursos utilizados:
--    - Agregações (COUNT, AVG)
--    - Filtros (WHERE)
--    - Ordenação (ORDER BY)
--    - Agrupamento (GROUP BY)
--    - Condicionais (CASE WHEN)

-- ============================================
-- FIM DO ARQUIVO
-- ============================================