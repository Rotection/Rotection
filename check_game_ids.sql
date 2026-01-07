-- Check Game IDs - Quick query to see what game IDs are actually in the database
-- Run this in Supabase SQL Editor to see all available game IDs

-- 1. Check what games exist in the base table
SELECT
    id,
    title,
    developer,
    status,
    created_at
FROM public.games
WHERE status = 'approved'
ORDER BY title;

-- 2. Check what games exist in the view (this is what the frontend queries)
SELECT
    id,
    title,
    developer,
    verified,
    safety_score,
    rating_count
FROM public.games_with_ratings
ORDER BY title;

-- 3. Show the exact IDs that should work in URLs
SELECT
    CONCAT('/game/', id) as url_path,
    title,
    developer
FROM public.games_with_ratings
ORDER BY title;

-- 4. Test a specific game ID (first one from our seed data)
SELECT
    id,
    title,
    developer,
    description
FROM public.games_with_ratings
WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid;

-- 5. Count total games
SELECT
    COUNT(*) as total_games,
    COUNT(*) FILTER (WHERE verified = true) as verified_games
FROM public.games_with_ratings;
