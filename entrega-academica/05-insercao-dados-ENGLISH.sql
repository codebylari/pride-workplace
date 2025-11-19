-- ============================================
-- PROJETO LINKA+ - DATABASE
-- REQUIREMENT: DATA INSERTION
-- ============================================
-- Student: [YOUR NAME]
-- Course: Database
-- ============================================

-- IMPORTANT NOTE:
-- This script uses ENGLISH table and column names to match the REAL database schema
-- Use these UUIDs that exist in your database (get from auth.users table)

-- ============================================
-- INSERTING USER ROLES (at least 5 records)
-- ============================================

-- ⚠️ CRITICAL: GET REAL UUIDs FROM YOUR DATABASE FIRST!
-- Run this query to get existing user IDs:
-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- ⚠️ REPLACE ALL UUIDs BELOW WITH REAL ONES FROM YOUR DATABASE!
-- Example structure (DO NOT USE THESE FAKE UUIDs):

INSERT INTO user_roles (user_id, role) VALUES
-- Get 1 real UUID for admin from auth.users
('PUT-REAL-ADMIN-UUID-HERE'::uuid, 'admin'),

-- Get 5 real UUIDs for candidates from auth.users
('PUT-REAL-CANDIDATE-UUID-1'::uuid, 'candidate'),
('PUT-REAL-CANDIDATE-UUID-2'::uuid, 'candidate'),
('PUT-REAL-CANDIDATE-UUID-3'::uuid, 'candidate'),
('PUT-REAL-CANDIDATE-UUID-4'::uuid, 'candidate'),
('PUT-REAL-CANDIDATE-UUID-5'::uuid, 'candidate'),

-- Get 5 real UUIDs for companies from auth.users
('PUT-REAL-COMPANY-UUID-1'::uuid, 'company'),
('PUT-REAL-COMPANY-UUID-2'::uuid, 'company'),
('PUT-REAL-COMPANY-UUID-3'::uuid, 'company'),
('PUT-REAL-COMPANY-UUID-4'::uuid, 'company'),
('PUT-REAL-COMPANY-UUID-5'::uuid, 'company')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- INSERTING CANDIDATE PROFILES (at least 5 records)
-- ============================================

-- ⚠️ Use the same candidate UUIDs from user_roles above
INSERT INTO profiles (
    id, 
    full_name, 
    city, 
    state, 
    experience_level, 
    work_area,
    about_me,
    linkedin_url
) VALUES
('PUT-REAL-CANDIDATE-UUID-1'::uuid, 'Ana Silva Santos', 'São Paulo', 'SP', 'Pleno', 'Desenvolvimento Web', 'Desenvolvedora Full Stack com 3 anos de experiência', 'https://linkedin.com/in/anasilva'),
('PUT-REAL-CANDIDATE-UUID-2'::uuid, 'Carlos Eduardo Oliveira', 'Rio de Janeiro', 'RJ', 'Sênior', 'DevOps', 'Especialista em infraestrutura cloud', 'https://linkedin.com/in/carloseduardo'),
('PUT-REAL-CANDIDATE-UUID-3'::uuid, 'Mariana Costa Lima', 'Belo Horizonte', 'MG', 'Júnior', 'UI/UX Design', 'Designer apaixonada por criar experiências incríveis', 'https://linkedin.com/in/marianacosta'),
('PUT-REAL-CANDIDATE-UUID-4'::uuid, 'Pedro Henrique Santos', 'Porto Alegre', 'RS', 'Pleno', 'Análise de Dados', 'Analista de dados com foco em business intelligence', 'https://linkedin.com/in/pedrosantos'),
('PUT-REAL-CANDIDATE-UUID-5'::uuid, 'Juliana Ferreira Souza', 'Curitiba', 'PR', 'Júnior', 'Marketing Digital', 'Profissional de marketing com experiência em redes sociais', 'https://linkedin.com/in/julianaferreira')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INSERTING COMPANY PROFILES (at least 5 records)
-- ============================================

-- ⚠️ Use the same company UUIDs from user_roles above
INSERT INTO company_profiles (
    user_id, 
    fantasy_name, 
    cnpj, 
    sector, 
    city, 
    state, 
    description,
    about
) VALUES
('PUT-REAL-COMPANY-UUID-1'::uuid, 'TechInova Solutions', '12.345.678/0001-90', 'Technology', 'São Paulo', 'SP', 'Software development company', 'Leaders in digital transformation'),
('PUT-REAL-COMPANY-UUID-2'::uuid, 'DataCo Analytics', '23.456.789/0001-01', 'Data Science', 'Rio de Janeiro', 'RJ', 'Data analysis and AI', 'Transforming data into insights'),
('PUT-REAL-COMPANY-UUID-3'::uuid, 'DesignHub Studio', '34.567.890/0001-12', 'Design', 'Belo Horizonte', 'MG', 'Creative design agency', 'Creating visual experiences'),
('PUT-REAL-COMPANY-UUID-4'::uuid, 'CloudMasters Inc', '45.678.901/0001-23', 'Cloud Computing', 'Porto Alegre', 'RS', 'Cloud infrastructure specialists', 'Building the future in the cloud'),
('PUT-REAL-COMPANY-UUID-5'::uuid, 'Marketing Plus Digital', '56.789.012/0001-34', 'Marketing', 'Curitiba', 'PR', 'Digital marketing agency', 'Growing brands digitally')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- INSERTING JOBS (at least 5 records)
-- ============================================

-- ⚠️ Use the same company UUIDs from company_profiles above
INSERT INTO jobs (
    company_id, 
    title, 
    description, 
    job_type, 
    location, 
    salary,
    is_remote,
    required_experience_level
) VALUES
('PUT-REAL-COMPANY-UUID-1'::uuid, 'Full Stack Developer', 'Develop web applications with React and Node.js', 'CLT', 'São Paulo, SP', 'R$ 8.000 - R$ 12.000', true, 'Pleno'),
('PUT-REAL-COMPANY-UUID-2'::uuid, 'Data Scientist', 'Analyze data and build ML models', 'PJ', 'Rio de Janeiro, RJ', 'R$ 10.000 - R$ 15.000', true, 'Sênior'),
('PUT-REAL-COMPANY-UUID-3'::uuid, 'UI/UX Designer', 'Design intuitive and beautiful interfaces', 'CLT', 'Belo Horizonte, MG', 'R$ 5.000 - R$ 7.000', false, 'Júnior'),
('PUT-REAL-COMPANY-UUID-4'::uuid, 'DevOps Engineer', 'Manage cloud infrastructure and CI/CD', 'CLT', 'Porto Alegre, RS', 'R$ 9.000 - R$ 13.000', true, 'Pleno'),
('PUT-REAL-COMPANY-UUID-5'::uuid, 'Social Media Manager', 'Manage social media campaigns', 'PJ', 'Curitiba, PR', 'R$ 4.000 - R$ 6.000', true, 'Júnior')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING APPLICATIONS (at least 5 records)
-- ============================================

-- ⚠️ Use the candidate UUIDs from profiles above
-- Jobs are auto-selected by title from the jobs table

INSERT INTO applications (
    candidate_id, 
    job_id, 
    status
) VALUES
('PUT-REAL-CANDIDATE-UUID-1'::uuid, (SELECT id FROM jobs WHERE title = 'Full Stack Developer' LIMIT 1), 'pending'),
('PUT-REAL-CANDIDATE-UUID-2'::uuid, (SELECT id FROM jobs WHERE title = 'DevOps Engineer' LIMIT 1), 'accepted'),
('PUT-REAL-CANDIDATE-UUID-3'::uuid, (SELECT id FROM jobs WHERE title = 'UI/UX Designer' LIMIT 1), 'pending'),
('PUT-REAL-CANDIDATE-UUID-4'::uuid, (SELECT id FROM jobs WHERE title = 'Data Scientist' LIMIT 1), 'rejected'),
('PUT-REAL-CANDIDATE-UUID-5'::uuid, (SELECT id FROM jobs WHERE title = 'Social Media Manager' LIMIT 1), 'accepted')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING RATINGS (at least 5 records)
-- ============================================

-- Note: Ratings require completed applications with contract_status = 'completed'
-- First update some applications to completed status:

UPDATE applications 
SET contract_status = 'completed', completed_at = NOW()
WHERE status = 'accepted'
LIMIT 2;

-- ⚠️ Use the UUIDs you set above
INSERT INTO ratings (
    application_id,
    rater_id,
    rated_user_id,
    rating,
    comment
) VALUES
-- Company rating candidate
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), 'PUT-REAL-COMPANY-UUID-2'::uuid, 'PUT-REAL-CANDIDATE-UUID-2'::uuid, 4.5, 'Excellent professional, delivered on time'),
-- Candidate rating company
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-2'::uuid, 'PUT-REAL-COMPANY-UUID-2'::uuid, 5.0, 'Great company to work with'),
-- More ratings
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 1 LIMIT 1), 'PUT-REAL-COMPANY-UUID-5'::uuid, 'PUT-REAL-CANDIDATE-UUID-5'::uuid, 4.0, 'Good work ethic'),
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 1 LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-5'::uuid, 'PUT-REAL-COMPANY-UUID-5'::uuid, 4.5, 'Professional environment'),
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), 'PUT-REAL-COMPANY-UUID-1'::uuid, 'PUT-REAL-CANDIDATE-UUID-1'::uuid, 5.0, 'Outstanding developer')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING NOTIFICATIONS (at least 5 records)
-- ============================================

-- ⚠️ Use the UUIDs you set above
INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_id
) VALUES
('PUT-REAL-CANDIDATE-UUID-1'::uuid, 'New Match!', 'You matched with TechInova Solutions', 'match', (SELECT id FROM jobs WHERE title = 'Full Stack Developer' LIMIT 1)),
('PUT-REAL-COMPANY-UUID-2'::uuid, 'New Application', 'Ana Silva Santos applied for your job', 'new_application', (SELECT id FROM applications WHERE candidate_id = 'PUT-REAL-CANDIDATE-UUID-1'::uuid LIMIT 1)),
('PUT-REAL-CANDIDATE-UUID-2'::uuid, 'Application Accepted!', 'Your application was accepted', 'application_accepted', (SELECT id FROM applications WHERE candidate_id = 'PUT-REAL-CANDIDATE-UUID-2'::uuid LIMIT 1)),
('PUT-REAL-CANDIDATE-UUID-3'::uuid, 'Profile Viewed', 'DesignHub Studio viewed your profile', 'profile_view', NULL),
('PUT-REAL-COMPANY-UUID-1'::uuid, 'New Rating', 'You received a 5-star rating', 'new_rating', (SELECT id FROM ratings WHERE rated_user_id = 'PUT-REAL-COMPANY-UUID-1'::uuid LIMIT 1))
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING TESTIMONIALS (at least 5 records)
-- ============================================

-- ⚠️ Use the UUIDs you set above
INSERT INTO testimonials (
    application_id,
    candidate_id,
    company_id,
    job_title,
    comment,
    status
) VALUES
((SELECT id FROM applications WHERE contract_status = 'completed' LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-2'::uuid, 'PUT-REAL-COMPANY-UUID-2'::uuid, 'DevOps Engineer', 'Amazing experience working here. Great team and challenging projects.', 'approved'),
((SELECT id FROM applications WHERE contract_status = 'completed' OFFSET 1 LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-5'::uuid, 'PUT-REAL-COMPANY-UUID-5'::uuid, 'Social Media Manager', 'Learned a lot and had great support from the team.', 'approved'),
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-1'::uuid, 'PUT-REAL-COMPANY-UUID-1'::uuid, 'Full Stack Developer', 'Professional environment with growth opportunities.', 'pending'),
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 2 LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-3'::uuid, 'PUT-REAL-COMPANY-UUID-3'::uuid, 'UI/UX Designer', 'Creative freedom and supportive leadership.', 'approved'),
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 3 LIMIT 1), 'PUT-REAL-CANDIDATE-UUID-4'::uuid, 'PUT-REAL-COMPANY-UUID-4'::uuid, 'Data Scientist', 'Innovative company with cutting-edge technology.', 'pending')
ON CONFLICT (application_id) DO NOTHING;

-- ============================================
-- DATA VERIFICATION
-- ============================================

-- Check record counts in each table
SELECT 'user_roles' AS table_name, COUNT(*) AS record_count FROM user_roles
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'company_profiles', COUNT(*) FROM company_profiles
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'applications', COUNT(*) FROM applications
UNION ALL
SELECT 'ratings', COUNT(*) FROM ratings
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials;

-- ============================================
-- REQUIREMENT VERIFICATION
-- ============================================

-- ✅ REQUIREMENT: At least 5 records in each table
--    Verify that all tables have at least 5 records:
--    - user_roles: 6 records (1 admin + 3 candidates + 2 companies)
--    - profiles: 5 candidate records
--    - company_profiles: 5 company records
--    - jobs: 5 job postings
--    - applications: 5 applications
--    - ratings: 5 ratings
--    - notifications: 5 notifications
--    - testimonials: 5 testimonials

-- ============================================
-- END OF FILE
-- ============================================
