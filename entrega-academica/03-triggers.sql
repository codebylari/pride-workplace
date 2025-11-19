-- ============================================
-- PROJETO LINKA+ - BANCO DE DADOS
-- REQUISITO: CRIAÇÃO DE TRIGGERS
-- ============================================
-- Aluno: [SEU NOME]
-- Disciplina: Banco de Dados
-- ============================================

-- ============================================
-- TRIGGER 1: Atualizar avaliação após INSERT
-- ============================================

-- Passo 1: Criar a função que será executada pelo trigger
CREATE OR REPLACE FUNCTION trigger_atualizar_avaliacao()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o avaliado é um candidato
    IF EXISTS (SELECT 1 FROM perfis_candidatos WHERE id_candidato = NEW.avaliado_id) THEN
        -- Chama função para atualizar avaliação do candidato
        PERFORM atualizar_avaliacao_candidato(NEW.avaliado_id);
        RAISE NOTICE 'Avaliação do candidato % atualizada', NEW.avaliado_id;
    
    -- Verifica se o avaliado é uma empresa
    ELSIF EXISTS (SELECT 1 FROM perfis_empresas WHERE user_id = NEW.avaliado_id) THEN
        -- Chama função para atualizar avaliação da empresa
        PERFORM atualizar_avaliacao_empresa(NEW.avaliado_id);
        RAISE NOTICE 'Avaliação da empresa % atualizada', NEW.avaliado_id;
    END IF;
    
    RETURN NEW;  -- Retorna o novo registro inserido
END;
$$ LANGUAGE plpgsql;

-- Passo 2: Criar o trigger que dispara APÓS INSERT
CREATE TRIGGER avaliacao_inserida
AFTER INSERT ON avaliacoes           -- Executa APÓS inserção na tabela avaliacoes
FOR EACH ROW                          -- Para cada linha inserida
EXECUTE FUNCTION trigger_atualizar_avaliacao();  -- Executa a função criada acima

-- ============================================
-- TRIGGER 2: Criar notificação após INSERT
-- ============================================

-- Passo 1: Criar a função que será executada pelo trigger
CREATE OR REPLACE FUNCTION trigger_criar_notificacao_candidatura()
RETURNS TRIGGER AS $$
DECLARE
    v_nome_candidato VARCHAR(255);    -- Variável para nome do candidato
    v_titulo_vaga VARCHAR(255);       -- Variável para título da vaga
    v_empresa_id INTEGER;             -- Variável para ID da empresa
BEGIN
    -- Busca o nome do candidato
    SELECT nome_completo INTO v_nome_candidato
    FROM perfis_candidatos
    WHERE id_candidato = NEW.candidato_id;
    
    -- Busca o título da vaga e ID da empresa
    SELECT titulo, empresa_id INTO v_titulo_vaga, v_empresa_id
    FROM vagas
    WHERE id_vaga = NEW.vaga_id;
    
    -- Cria uma notificação para a empresa
    INSERT INTO notificacoes (user_id, titulo, mensagem, tipo, relacionado_id)
    VALUES (
        v_empresa_id,
        'Nova Candidatura',
        v_nome_candidato || ' se candidatou para a vaga ' || v_titulo_vaga,
        'new_application',
        NEW.id_candidatura
    );
    
    RAISE NOTICE 'Notificação criada para empresa % sobre candidatura %', 
                 v_empresa_id, NEW.id_candidatura;
    
    RETURN NEW;  -- Retorna o novo registro inserido
END;
$$ LANGUAGE plpgsql;

-- Passo 2: Criar o trigger que dispara APÓS INSERT
CREATE TRIGGER candidatura_criada
AFTER INSERT ON candidaturas         -- Executa APÓS inserção na tabela candidaturas
FOR EACH ROW                          -- Para cada linha inserida
EXECUTE FUNCTION trigger_criar_notificacao_candidatura();  -- Executa a função

-- ============================================
-- TESTE DOS TRIGGERS
-- ============================================

-- Teste 1: Inserir uma avaliação (dispara trigger 1)
-- INSERT INTO avaliacoes (avaliador_id, avaliado_id, candidatura_id, nota, comentario)
-- VALUES (2001, 1, 1, 4.5, 'Excelente profissional!');
-- → Resultado esperado: Campo "avaliacao" em perfis_candidatos é atualizado

-- Teste 2: Inserir uma candidatura (dispara trigger 2)
-- INSERT INTO candidaturas (candidato_id, vaga_id, status)
-- VALUES (1, 1, 'pending');
-- → Resultado esperado: Nova notificação criada na tabela notificacoes

-- Verificar se trigger foi disparado:
-- SELECT * FROM notificacoes ORDER BY data_criacao DESC LIMIT 1;

-- ============================================
-- VERIFICAÇÃO DOS REQUISITOS
-- ============================================

-- ✅ REQUISITO: Trigger executada na INSERÇÃO de registros
--    → Criados 2 triggers:
--      1. avaliacao_inserida
--         - Dispara APÓS INSERT na tabela "avaliacoes"
--         - Atualiza automaticamente a média de avaliações
--      
--      2. candidatura_criada
--         - Dispara APÓS INSERT na tabela "candidaturas"
--         - Cria automaticamente uma notificação para a empresa
--
--    Ambos triggers:
--    - Executam AFTER INSERT (após inserção)
--    - FOR EACH ROW (para cada linha)
--    - Usam funções PL/pgSQL
--    - Manipulam dados automaticamente
--    - Usam variáveis (DECLARE)
--    - Executam queries (SELECT, INSERT, UPDATE)

-- ============================================
-- COMANDOS ÚTEIS PARA GERENCIAR TRIGGERS
-- ============================================

-- Listar todos os triggers do banco:
-- SELECT * FROM pg_trigger;

-- Desabilitar um trigger:
-- ALTER TABLE avaliacoes DISABLE TRIGGER avaliacao_inserida;

-- Habilitar um trigger:
-- ALTER TABLE avaliacoes ENABLE TRIGGER avaliacao_inserida;

-- Remover um trigger:
-- DROP TRIGGER IF EXISTS avaliacao_inserida ON avaliacoes;

-- ============================================
-- FIM DO ARQUIVO
-- ============================================