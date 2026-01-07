-- Verify what tables were created in the database
-- Run this to see if the migration worked

-- List all tables in the public schema
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if specific tables exist
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'games')
        THEN '✓ games table exists'
        ELSE '✗ games table missing'
    END as games_status,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'game_ratings')
        THEN '✓ game_ratings table exists'
        ELSE '✗ game_ratings table missing'
    END as ratings_status,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'game_reviews')
        THEN '✓ game_reviews table exists'
        ELSE '✗ game_reviews table missing'
    END as reviews_status,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'game_reports')
        THEN '✓ game_reports table exists'
        ELSE '✗ game_reports table missing'
    END as reports_status,
    CASE
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'game_submissions')
        THEN '✓ game_submissions table exists'
        ELSE '✗ game_submissions table missing'
    END as submissions_status;

-- Check if views
