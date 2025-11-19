-- ============================================
-- PROJETO LINKA+ - BANCO DE DADOS
-- REQUISITO: INSERÇÃO DE DADOS
-- ============================================
-- Aluno: [SEU NOME]
-- Disciplina: Banco de Dados
-- ============================================

-- ============================================
-- INSERÇÃO EM: papeis_usuarios
-- Requisito: Mínimo 5 registros
-- Total inserido: 11 registros
-- ============================================

INSERT INTO papeis_usuarios (user_id, papel) VALUES
(1001, 'admin'),        -- Usuário admin
(1002, 'candidate'),    -- Candidato 1
(1003, 'candidate'),    -- Candidato 2
(1004, 'candidate'),    -- Candidato 3
(1005, 'candidate'),    -- Candidato 4
(1006, 'candidate'),    -- Candidato 5
(2001, 'company'),      -- Empresa 1
(2002, 'company'),      -- Empresa 2
(2003, 'company'),      -- Empresa 3
(2004, 'company'),      -- Empresa 4
(2005, 'company');      -- Empresa 5

-- ============================================
-- INSERÇÃO EM: perfis_candidatos
-- Requisito: Mínimo 5 registros
-- Total inserido: 5 registros
-- ============================================

INSERT INTO perfis_candidatos (user_id, nome_completo, nome_social, cidade, estado, nivel_experiencia, area_trabalho, linkedin_url, sobre_mim) VALUES
(1002, 'João Silva Santos', NULL, 'São Paulo', 'SP', 'Junior', 'Desenvolvimento Web', 'https://linkedin.com/in/joaosilva', 'Desenvolvedor front-end apaixonado por tecnologia e inovação. Experiência com React, TypeScript e Tailwind CSS.'),
(1003, 'Maria Oliveira Costa', NULL, 'Rio de Janeiro', 'RJ', 'Pleno', 'Desenvolvimento Mobile', 'https://linkedin.com/in/mariaoliveira', 'Desenvolvedora mobile com 3 anos de experiência em React Native. Focada em criar apps com UX excepcional.'),
(1004, 'Pedro Henrique Souza', NULL, 'Belo Horizonte', 'MG', 'Senior', 'DevOps', 'https://linkedin.com/in/pedrohenrique', 'Especialista em infraestrutura cloud, Docker, Kubernetes e CI/CD. 5+ anos de experiência em DevOps.'),
(1005, 'Ana Paula Ferreira', 'Ana', 'Curitiba', 'PR', 'Junior', 'UI/UX Design', 'https://linkedin.com/in/anapaula', 'Designer UI/UX focada em criar experiências incríveis. Domínio em Figma, Adobe XD e Design Systems.'),
(1006, 'Carlos Eduardo Lima', NULL, 'Porto Alegre', 'RS', 'Pleno', 'Data Science', 'https://linkedin.com/in/carloseduardo', 'Cientista de dados especializado em machine learning e análise preditiva. Python, R e TensorFlow.');

-- ============================================
-- INSERÇÃO EM: perfis_empresas
-- Requisito: Mínimo 5 registros
-- Total inserido: 5 registros
-- ============================================

INSERT INTO perfis_empresas (user_id, nome_fantasia, cnpj, setor, cidade, estado, descricao, sobre) VALUES
(2001, 'TechInova Solutions', '12.345.678/0001-90', 'Tecnologia', 'São Paulo', 'SP', 'Empresa de desenvolvimento de software especializada em soluções empresariais', 'Somos líderes em transformação digital, ajudando empresas a alcançarem seus objetivos através da tecnologia.'),
(2002, 'DataCorp Analytics', '23.456.789/0001-01', 'Tecnologia', 'Rio de Janeiro', 'RJ', 'Consultoria em análise de dados e business intelligence', 'Transformamos dados em insights acionáveis. Especialistas em Big Data, BI e análise preditiva.'),
(2003, 'MobileTech Apps', '34.567.890/0001-12', 'Tecnologia', 'Florianópolis', 'SC', 'Desenvolvimento de aplicativos móveis para iOS e Android', 'Criamos aplicativos móveis que encantam usuários e transformam negócios. Mais de 50 apps publicados.'),
(2004, 'CloudSys Infrastructure', '45.678.901/0001-23', 'Tecnologia', 'Brasília', 'DF', 'Infraestrutura em nuvem e serviços cloud computing', 'Especialistas em AWS, Azure e GCP. Migramos e otimizamos sua infraestrutura para a nuvem.'),
(2005, 'DesignHub Studio', '56.789.012/0001-34', 'Design', 'Belo Horizonte', 'MG', 'Estúdio de design digital focado em UX/UI', 'Design que encanta e converte. Criamos interfaces memoráveis para web e mobile.');

-- ============================================
-- INSERÇÃO EM: vagas
-- Requisito: Mínimo 5 registros
-- Total inserido: 6 registros
-- ============================================

INSERT INTO vagas (empresa_id, titulo, descricao, localizacao, salario, tipo_trabalho, remoto) VALUES
(2001, 'Desenvolvedor Front-end React', 'Buscamos desenvolvedor React para atuar em projetos inovadores. Experiência com TypeScript, Tailwind e testes é um diferencial.', 'São Paulo, SP', 'R$ 5.000 - R$ 7.000', 'CLT', TRUE),
(2001, 'Desenvolvedor Back-end Node.js', 'Desenvolvedor back-end com experiência em Node.js, Express e APIs REST. Conhecimento em PostgreSQL e MongoDB.', 'São Paulo, SP', 'R$ 6.000 - R$ 8.000', 'CLT', TRUE),
(2002, 'Cientista de Dados Senior', 'Cientista de dados para análise avançada e machine learning. Python, SQL, scikit-learn e TensorFlow são essenciais.', 'Rio de Janeiro, RJ', 'R$ 10.000 - R$ 14.000', 'CLT', FALSE),
(2003, 'Desenvolvedor Mobile React Native', 'Desenvolvedor mobile para criar apps iOS e Android usando React Native. Experiência com publicação nas stores.', 'Florianópolis, SC', 'R$ 7.000 - R$ 9.000', 'PJ', TRUE),
(2004, 'Engenheiro DevOps', 'Engenheiro para infraestrutura cloud e automação. AWS, Docker, Kubernetes e Terraform são obrigatórios.', 'Brasília, DF', 'R$ 9.000 - R$ 12.000', 'CLT', TRUE),
(2005, 'UI/UX Designer', 'Designer para criar interfaces incríveis para web e mobile. Domínio em Figma e conhecimento de front-end é um plus.', 'Belo Horizonte, MG', 'R$ 4.500 - R$ 6.500', 'CLT', FALSE);

-- ============================================
-- INSERÇÃO EM: candidaturas
-- Requisito: Mínimo 5 registros
-- Total inserido: 8 registros
-- ============================================

INSERT INTO candidaturas (candidato_id, vaga_id, status) VALUES
(1, 1, 'accepted'),     -- João aceito para Front-end React
(2, 4, 'pending'),      -- Maria candidata a Mobile React Native (pendente)
(3, 5, 'accepted'),     -- Pedro aceito para DevOps
(4, 6, 'pending'),      -- Ana candidata a UI/UX Designer (pendente)
(5, 3, 'rejected'),     -- Carlos rejeitado para Cientista de Dados
(1, 2, 'pending'),      -- João candidato a Back-end Node.js (pendente)
(2, 1, 'rejected'),     -- Maria rejeitada para Front-end React
(3, 2, 'accepted');     -- Pedro aceito para Back-end Node.js

-- ============================================
-- INSERÇÃO EM: avaliacoes
-- Requisito: Mínimo 5 registros
-- Total inserido: 5 registros
-- ============================================
-- Nota: Esta tabela precisa ser criada primeiro
-- Ver arquivo 01-criacao-tabelas.sql

CREATE TABLE IF NOT EXISTS avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    avaliador_id INTEGER NOT NULL,
    avaliado_id INTEGER NOT NULL,
    candidatura_id INTEGER NOT NULL,
    nota DECIMAL(2,1) NOT NULL CHECK (nota >= 1.0 AND nota <= 5.0),
    comentario TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliador_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE,
    FOREIGN KEY (avaliado_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE,
    FOREIGN KEY (candidatura_id) REFERENCES candidaturas(id_candidatura) ON DELETE CASCADE
);

INSERT INTO avaliacoes (avaliador_id, avaliado_id, candidatura_id, nota, comentario) VALUES
(2001, 1002, 1, 4.5, 'Excelente profissional! Muito dedicado, pontual e com ótimas habilidades técnicas. Recomendo fortemente.'),
(1002, 2001, 1, 5.0, 'Empresa maravilhosa! Ambiente colaborativo, projetos desafiadores e ótima cultura organizacional.'),
(2004, 1004, 3, 4.8, 'Conhecimento técnico excepcional. Pedro domina DevOps e entregou além do esperado. Profissional exemplar.'),
(1004, 2004, 3, 4.5, 'Ótimo ambiente de trabalho com desafios interessantes. Equipe colaborativa e tecnologias de ponta.'),
(2001, 1002, 6, 3.5, 'Bom profissional com habilidades técnicas sólidas, mas precisa melhorar a comunicação em equipe.');

-- ============================================
-- INSERÇÃO EM: notificacoes
-- Requisito: Mínimo 5 registros
-- Total inserido: 5 registros
-- ============================================

CREATE TABLE IF NOT EXISTS notificacoes (
    id_notificacao SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    relacionado_id INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

INSERT INTO notificacoes (user_id, titulo, mensagem, tipo, relacionado_id, lida) VALUES
(1002, 'Nova Correspondência', 'Você tem um novo match com TechInova Solutions para a vaga de Desenvolvedor Front-end React', 'new_match', 1, FALSE),
(2001, 'Nova Candidatura', 'João Silva Santos se candidatou para a vaga Desenvolvedor Front-end React', 'new_application', 1, FALSE),
(1003, 'Candidatura Aceita', 'Parabéns! Sua candidatura foi aceita pela CloudSys Infrastructure para a vaga de Engenheiro DevOps', 'application_accepted', 3, FALSE),
(2004, 'Nova Correspondência', 'Você tem um novo match com Pedro Henrique Souza para a vaga de Engenheiro DevOps', 'new_match', 2, TRUE),
(1004, 'Avaliação Recebida', 'Você recebeu uma avaliação de 4.5 estrelas da CloudSys Infrastructure', 'new_rating', 4, FALSE);

-- ============================================
-- INSERÇÃO EM: depoimentos
-- Requisito: Mínimo 5 registros
-- Total inserido: 5 registros
-- ============================================

CREATE TABLE IF NOT EXISTS depoimentos (
    id_depoimento SERIAL PRIMARY KEY,
    candidato_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    candidatura_id INTEGER NOT NULL,
    titulo_vaga VARCHAR(255) NOT NULL,
    comentario TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidato_id) REFERENCES perfis_candidatos(id_candidato) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE,
    FOREIGN KEY (candidatura_id) REFERENCES candidaturas(id_candidatura) ON DELETE CASCADE
);

INSERT INTO depoimentos (candidato_id, empresa_id, candidatura_id, titulo_vaga, comentario, status) VALUES
(1, 2001, 1, 'Desenvolvedor Front-end React', 'Experiência incrível na TechInova! Aprendi muito e cresci profissionalmente. Projetos desafiadores e equipe colaborativa.', 'approved'),
(3, 2004, 3, 'Engenheiro DevOps', 'CloudSys é uma empresa séria com ótimos projetos. Equipe colaborativa e tecnologias de ponta. Recomendo!', 'approved'),
(5, 2002, 5, 'Cientista de Dados Senior', 'Processo seletivo transparente e bem organizado. Infelizmente a vaga não era exatamente o que eu esperava.', 'pending'),
(1, 2001, 6, 'Desenvolvedor Back-end Node.js', 'Ambiente desafiador com tecnologias modernas. Aprendi muito sobre arquitetura de software e boas práticas.', 'approved'),
(2, 2003, 2, 'Desenvolvedor Mobile React Native', 'Boa empresa com projetos interessantes, mas poderia melhorar a comunicação interna entre as equipes.', 'pending');

-- ============================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ============================================

-- Verificar contagem de registros em cada tabela:
SELECT 'papeis_usuarios' as tabela, COUNT(*) as total FROM papeis_usuarios
UNION ALL
SELECT 'perfis_candidatos', COUNT(*) FROM perfis_candidatos
UNION ALL
SELECT 'perfis_empresas', COUNT(*) FROM perfis_empresas
UNION ALL
SELECT 'vagas', COUNT(*) FROM vagas
UNION ALL
SELECT 'candidaturas', COUNT(*) FROM candidaturas
UNION ALL
SELECT 'avaliacoes', COUNT(*) FROM avaliacoes
UNION ALL
SELECT 'notificacoes', COUNT(*) FROM notificacoes
UNION ALL
SELECT 'depoimentos', COUNT(*) FROM depoimentos;

-- ============================================
-- VERIFICAÇÃO DOS REQUISITOS
-- ============================================

-- ✅ REQUISITO: Inserção de pelo menos 5 registros em cada tabela
--    → Registros inseridos por tabela:
--      - papeis_usuarios: 11 registros ✅
--      - perfis_candidatos: 5 registros ✅
--      - perfis_empresas: 5 registros ✅
--      - vagas: 6 registros ✅
--      - candidaturas: 8 registros ✅
--      - avaliacoes: 5 registros ✅
--      - notificacoes: 5 registros ✅
--      - depoimentos: 5 registros ✅
--
--    TODAS as tabelas possuem 5 ou mais registros!

-- ============================================
-- FIM DO ARQUIVO
-- ============================================