-- ============================================
-- PROJETO LINKA+ - DATABASE
-- REQUIREMENT: TRIGGER CREATION
-- ============================================
-- Student: [YOUR NAME]
-- Course: Database
-- ============================================

-- ============================================
-- TRIGGER 1: Update rating after INSERT
-- ============================================

-- Step 1: Create the function that will be executed by the trigger
CREATE OR REPLACE FUNCTION trigger_update_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if rated user is a candidate
    IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.rated_user_id) THEN
        -- Call function to update candidate's rating
        PERFORM update_candidate_rating(NEW.rated_user_id);
        RAISE NOTICE 'Candidate % rating updated', NEW.rated_user_id;
    
    -- Check if rated user is a company
    ELSIF EXISTS (SELECT 1 FROM company_profiles WHERE user_id = NEW.rated_user_id) THEN
        -- Call function to update company's rating
        PERFORM update_company_rating(NEW.rated_user_id);
        RAISE NOTICE 'Company % rating updated', NEW.rated_user_id;
    END IF;
    
    RETURN NEW;  -- Return the new inserted record
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger that fires AFTER INSERT
CREATE TRIGGER rating_inserted
AFTER INSERT ON ratings              -- Execute AFTER insertion in ratings table
FOR EACH ROW                          -- For each inserted row
EXECUTE FUNCTION trigger_update_rating();  -- Execute the function created above

-- ============================================
-- TRIGGER 2: Create notification after INSERT
-- ============================================

-- Step 1: Create the function that will be executed by the trigger
CREATE OR REPLACE FUNCTION trigger_create_application_notification()
RETURNS TRIGGER AS $$
DECLARE
    v_candidate_name VARCHAR(255);    -- Variable for candidate name
    v_job_title VARCHAR(255);         -- Variable for job title
    v_company_id UUID;                -- Variable for company ID
BEGIN
    -- Get candidate name
    SELECT full_name INTO v_candidate_name
    FROM profiles
    WHERE id = NEW.candidate_id;
    
    -- Get job title and company ID
    SELECT title, company_id INTO v_job_title, v_company_id
    FROM jobs
    WHERE id = NEW.job_id;
    
    -- Create notification for the company
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
        v_company_id,
        'New Application',
        v_candidate_name || ' applied for the job ' || v_job_title,
        'new_application',
        NEW.id
    );
    
    RAISE NOTICE 'Notification created for company % about application %', 
                 v_company_id, NEW.id;
    
    RETURN NEW;  -- Return the new inserted record
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger that fires AFTER INSERT
CREATE TRIGGER application_created
AFTER INSERT ON applications         -- Execute AFTER insertion in applications table
FOR EACH ROW                          -- For each inserted row
EXECUTE FUNCTION trigger_create_application_notification();  -- Execute the function

-- ============================================
-- TRIGGER TESTING
-- ============================================

-- Test 1: Insert a rating (triggers trigger 1)
-- INSERT INTO ratings (rater_id, rated_user_id, application_id, rating, comment)
-- VALUES ('uuid-rater', 'uuid-rated', 'uuid-app', 4.5, 'Excellent professional!');
-- → Expected result: "rating" field in profiles is updated

-- Test 2: Insert an application (triggers trigger 2)
-- INSERT INTO applications (candidate_id, job_id, status)
-- VALUES ('uuid-candidate', 'uuid-job', 'pending');
-- → Expected result: New notification created in notifications table

-- Check if trigger was fired:
-- SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;

-- ============================================
-- REQUIREMENT VERIFICATION
-- ============================================

-- ✅ REQUIREMENT: Trigger that occurs on record insertion in a table
--    → Created 2 triggers:
--      1. rating_inserted - Fires AFTER INSERT on ratings table
--      2. application_created - Fires AFTER INSERT on applications table
--
--    Both triggers:
--    - Fire on INSERT operation
--    - Execute automatically when data is inserted
--    - Call functions with business logic
--    - Use DECLARE for variables
--    - Update/Insert data in other tables
--    - Written in PL/pgSQL

-- ============================================
-- EXPLANATION OF HOW TRIGGERS WORK
-- ============================================

-- 1. WHAT IS A TRIGGER?
--    - Automatic procedure that fires when an event occurs
--    - Events: INSERT, UPDATE, DELETE
--    - Can fire BEFORE or AFTER the event

-- 2. WHEN TO USE?
--    - Maintain data integrity
--    - Automate repetitive tasks
--    - Create audit logs
--    - Send notifications
--    - Update related data

-- 3. TRIGGER STRUCTURE:
--    a) Create FUNCTION with trigger logic
--    b) Create TRIGGER linked to a table
--    c) Define WHEN it fires (BEFORE/AFTER + INSERT/UPDATE/DELETE)

-- 4. SPECIAL VARIABLES:
--    - NEW: New record being inserted/updated
--    - OLD: Old record being updated/deleted (not used in INSERT)

-- ============================================
-- END OF FILE
-- ============================================
