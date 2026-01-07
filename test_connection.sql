-- Simple test to verify Supabase connection
SELECT 'Connection successful!' as message;

-- Check if profiles table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'profiles';

-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
