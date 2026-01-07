-- Diagnostic SQL Queries to Test Database Connection and RLS Policies
-- Run these in Supabase SQL Editor to diagnose why games aren't showing on website

-- 1. Check if games exist in base table
SELECT
    COUNT(*) as total_games,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_games,
    COUNT(*) FILTER (WHERE verified = true) as verified_games
FROM public.games;

-- 2. Check if games_with_ratings view exists and has data
SELECT
    COUNT(*) as view_count
FROM public.games_with_ratings;

-- 3. Test the exact query that the frontend uses
SELECT *
FROM public.games_with_ratings
WHERE status = 'approved'
ORDER BY rating_count DESC
LIMIT 10;

-- 4. Check RLS policies are working correctly
-- This simulates an anonymous user query (what the frontend does)
SET LOCAL ROLE 'anon';
SELECT
    id, title, developer, verified, status, safety_score, rating_count
FROM public.games_with_ratings
WHERE status = 'approved'
LIMIT 5;
RESET ROLE;

-- 5. Check if the view definition is correct
SELECT
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE viewname = 'games_with_ratings';

-- 6. Test featured games query (verified only, high safety)
SELECT
    title,
    developer,
    verified,
    safety_score,
    rating_count
FROM public.games_with_ratings
WHERE status = 'approved'
    AND verified = true
ORDER BY safety_score DESC
LIMIT 6;

-- 7. Check individual game access
SELECT
    id,
    title,
    roblox_id,
    status
FROM public.games
WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid;

-- 8. Test genre filtering
SELECT DISTINCT genre
FROM public.games_with_ratings
WHERE status = 'approved'
ORDER BY genre;

-- 9. Check for any error patterns in the data
SELECT
    title,
    CASE
        WHEN thumbnail_url IS NULL THEN 'Missing thumbnail'
        WHEN description IS NULL THEN 'Missing description'
        WHEN genre IS NULL THEN 'Missing genre'
        ELSE 'OK'
    END as data_status
FROM public.games
WHERE status = 'approved'
ORDER BY title;

-- 10. Final verification - simulate the exact getAllGames() call
SELECT
    g.*,
    COALESCE(AVG(r.honesty), 0)::decimal(2,1) as avg_honesty,
    COALESCE(AVG(r.safety), 0)::decimal(2,1) as avg_safety,
    COALESCE(AVG(r.fairness), 0)::decimal(2,1) as avg_fairness,
    COALESCE(AVG(r.age_appropriate), 0)::decimal(2,1) as avg_age_appropriate,
    COALESCE(AVG(r.overall_rating), 0)::decimal(2,1) as avg_overall_rating,
    COUNT(r.id)::integer as rating_count,
    CASE
        WHEN COUNT(r.id) = 0 THEN 50
        ELSE LEAST(100, GREATEST(0,
            ROUND((AVG(r.safety) * 0.4 + AVG(r.age_appropriate) * 0.3 + AVG(r.honesty) * 0.2 + AVG(r.fairness) * 0.1) * 20)
        ))
    END::integer as safety_score
FROM public.games g
LEFT JOIN public.game_ratings r ON g.id = r.game_id
WHERE g.status = 'approved'
GROUP BY g.id
ORDER BY rating_count DESC
LIMIT 5;
