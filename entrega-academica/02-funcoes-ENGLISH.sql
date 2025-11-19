-- ============================================
-- PROJETO LINKA+ - DATABASE
-- REQUIREMENT: FUNCTION CREATION
-- ============================================
-- Student: [YOUR NAME]
-- Course: Database
-- ============================================

-- ============================================
-- FUNCTION 1: update_candidate_rating
-- ============================================
-- Description: Calculates and updates a candidate's average rating
-- Parameter: p_candidate_id (UUID) - Candidate ID
-- Return: VOID (no return value)
-- Usage: Called automatically by trigger or manually

CREATE OR REPLACE FUNCTION update_candidate_rating(p_candidate_id UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(2,1);      -- Variable to store average
    total_count INTEGER;          -- Variable to count ratings
BEGIN
    -- Calculate average rating and count total ratings
    SELECT 
        ROUND(AVG(rating)::numeric, 1),
        COUNT(*)
    INTO avg_rating, total_count
    FROM ratings
    WHERE rated_user_id = p_candidate_id;
    
    -- Update candidate profile with new values
    UPDATE profiles
    SET 
        rating = COALESCE(avg_rating, 5.0),  -- If NULL, use 5.0
        total_ratings = total_count
    WHERE id = p_candidate_id;
    
    -- Log message (optional)
    RAISE NOTICE 'Candidate % updated: avg=%, total=%', 
                 p_candidate_id, COALESCE(avg_rating, 5.0), total_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 2: update_company_rating
-- ============================================
-- Description: Calculates and updates a company's average rating
-- Parameter: p_company_id (UUID) - Company ID (user_id)
-- Return: VOID (no return value)
-- Usage: Called automatically by trigger or manually

CREATE OR REPLACE FUNCTION update_company_rating(p_company_id UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(2,1);      -- Variable to store average
    total_count INTEGER;          -- Variable to count ratings
BEGIN
    -- Calculate average rating and count total ratings
    SELECT 
        ROUND(AVG(rating)::numeric, 1),
        COUNT(*)
    INTO avg_rating, total_count
    FROM ratings
    WHERE rated_user_id = p_company_id;
    
    -- Update company profile with new values
    UPDATE company_profiles
    SET 
        rating = COALESCE(avg_rating, 5.0),  -- If NULL, use 5.0
        total_ratings = total_count
    WHERE user_id = p_company_id;
    
    -- Log message (optional)
    RAISE NOTICE 'Company % updated: avg=%, total=%', 
                 p_company_id, COALESCE(avg_rating, 5.0), total_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION USAGE EXAMPLES
-- ============================================

-- Example 1: Update a specific candidate's rating
-- SELECT update_candidate_rating('uuid-here');

-- Example 2: Update a specific company's rating
-- SELECT update_company_rating('uuid-here');

-- Example 3: Update all candidates (loop)
-- DO $$
-- DECLARE
--     candidate RECORD;
-- BEGIN
--     FOR candidate IN SELECT id FROM profiles LOOP
--         PERFORM update_candidate_rating(candidate.id);
--     END LOOP;
-- END $$;

-- ============================================
-- REQUIREMENT VERIFICATION
-- ============================================

-- ✅ REQUIREMENT: Creation of at least 1 function
--    → Created 2 functions:
--      1. update_candidate_rating
--      2. update_company_rating
--
--    Both functions:
--    - Use DECLARE for variables
--    - Execute SQL queries (SELECT)
--    - Perform calculations (AVG, COUNT)
--    - Update data (UPDATE)
--    - Return void
--    - Written in PL/pgSQL

-- ============================================
-- END OF FILE
-- ============================================
