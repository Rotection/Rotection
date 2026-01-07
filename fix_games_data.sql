-- Fix Games Data - Simplified Script to Populate All Games
-- Run this in Supabase SQL Editor to ensure all 12 sample games are loaded

-- First, let's check what we have
-- SELECT COUNT(*) FROM public.games;

-- Clear any incomplete data first (optional - uncomment if needed)
-- DELETE FROM public.game_reviews;
-- DELETE FROM public.game_ratings;
-- DELETE FROM public.games;

-- Insert all 12 games with ON CONFLICT to avoid duplicates
INSERT INTO public.games (
    id,
    roblox_id,
    title,
    developer,
    description,
    thumbnail_url,
    roblox_url,
    genre,
    age_rating,
    verified,
    status,
    total_plays,
    created_at
) VALUES
-- Game 1: METALLIX Speedsters Sandbox
('550e8400-e29b-41d4-a716-446655440001'::uuid, '101411193179895', '[ METALLIX ] Speedsters Sandbox', 'Speedsters Sandbox', 'A safe and fun sandbox game where you can build, race, and explore with friends.', 'https://tr.rbxcdn.com/180DAY-bf6e00c4f61b35b36ea92d828e4c3232/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/101411193179895', 'Sandbox', '5+', true, 'approved', '1.2M', NOW() - INTERVAL '30 days'),

-- Game 2: MeepCity
('550e8400-e29b-41d4-a716-446655440002'::uuid, '142823291', 'MeepCity', 'alexnewtron', 'A social hangout game where you can customize your estate, adopt pets, and make friends.', 'https://tr.rbxcdn.com/180DAY-c15c7e5c2e51a96f9e71fd99ad7e8484/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/142823291', 'Social', '5+', true, 'approved', '8.5M', NOW() - INTERVAL '45 days'),

-- Game 3: Jailbreak
('550e8400-e29b-41d4-a716-446655440003'::uuid, '606849621', 'Jailbreak', 'Badimo', 'Team up with friends to escape prison or stop criminals as a police officer.', 'https://tr.rbxcdn.com/180DAY-7b4c4f89b3a4e2a9e2f6f7c8d9e0f1a2/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/606849621', 'Action', '7+', true, 'approved', '5.2M', NOW() - INTERVAL '20 days'),

-- Game 4: Phantom Forces
('550e8400-e29b-41d4-a716-446655440004'::uuid, '292439477', 'Phantom Forces', 'StyLiS Studios', 'A tactical FPS with realistic weapons and competitive gameplay.', 'https://tr.rbxcdn.com/180DAY-8c5d5f9a0c4b4e3a3e7f8c9d0e1f2a3b/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/292439477', 'FPS', '10+', true, 'approved', '1.8M', NOW() - INTERVAL '15 days'),

-- Game 5: Adopt Me!
('550e8400-e29b-41d4-a716-446655440005'::uuid, '920587237', 'Adopt Me!', 'DreamCraft', 'Raise and care for virtual pets in this wholesome adoption game.', 'https://tr.rbxcdn.com/180DAY-9d6e6f0a1b5c5f4a4f8f9c0d1e2f3a4c/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/920587237', 'Simulation', '5+', true, 'approved', '28.9M', NOW() - INTERVAL '60 days'),

-- Game 6: Brookhaven RP
('550e8400-e29b-41d4-a716-446655440006'::uuid, '746820961', 'Brookhaven RP', 'Wolfpaq', 'Role-play in a peaceful town with houses, cars, and jobs.', 'https://tr.rbxcdn.com/180DAY-ae7f7f1a2b6d6f5a5f9f0c1d2e3f4a5d/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/746820961', 'RPG', '5+', true, 'approved', '15.3M', NOW() - INTERVAL '10 days'),

-- Game 7: Build A Boat For Treasure
('550e8400-e29b-41d4-a716-446655440007'::uuid, '537413528', 'Build A Boat For Treasure', 'Chillz Studios', 'Build creative boats and navigate through challenging obstacles.', 'https://tr.rbxcdn.com/180DAY-bf8f8f2a3b7e7f6a6f0f1c2d3e4f5a6e/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/537413528', 'Building', '7+', true, 'approved', '2.1M', NOW() - INTERVAL '25 days'),

-- Game 8: Natural Disaster Survival
('550e8400-e29b-41d4-a716-446655440008'::uuid, '189707', 'Natural Disaster Survival', 'Stickmasterluke', 'Survive various natural disasters in this classic survival game.', 'https://tr.rbxcdn.com/180DAY-cf9f9f3a4b8f8f7a7f1f2c3d4e5f6a7f/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/189707', 'Survival', '7+', true, 'approved', '3.4M', NOW() - INTERVAL '40 days'),

-- Game 9: Prison Life
('550e8400-e29b-41d4-a716-446655440009'::uuid, '155615604', 'Prison Life', 'Aesthetical', 'Classic prison escape game with team-based gameplay.', 'https://tr.rbxcdn.com/180DAY-df0f0f4a5b9f9f8a8f2f3c4d5e6f7a8f/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/155615604', 'Action', '10+', false, 'approved', '967K', NOW() - INTERVAL '35 days'),

-- Game 10: Arsenal
('550e8400-e29b-41d4-a716-446655440010'::uuid, '286090429', 'Arsenal', 'ROLVe Community', 'Fast-paced FPS with rotating weapons and competitive matches.', 'https://tr.rbxcdn.com/180DAY-ef1f1f5a6b0f0f9a9f3f4c5d6e7f8a9f/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/286090429', 'FPS', '10+', true, 'approved', '1.9M', NOW() - INTERVAL '18 days'),

-- Game 11: Bloxburg
('550e8400-e29b-41d4-a716-446655440011'::uuid, '2753915549', 'Bloxburg', 'Coeptus', 'Life simulation game where you can build houses, get jobs, and live a virtual life.', 'https://tr.rbxcdn.com/180DAY-ff2f2f6a7b1f1f0a0f4f5c6d7e8f9a0f/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/2753915549', 'Simulation', '7+', true, 'approved', '6.8M', NOW() - INTERVAL '22 days'),

-- Game 12: Tower Defense Simulator
('550e8400-e29b-41d4-a716-446655440012'::uuid, '4282985734', 'Tower Defense Simulator', 'Paradoxum Games', 'Strategic tower defense game with cooperative multiplayer.', 'https://tr.rbxcdn.com/180DAY-103f3f7a8b2f2f1a1f5f6c7d8e9f0a1f/768/432/Image/Webp/noFilter', 'https://www.roblox.com/games/4282985734', 'Strategy', '7+', true, 'approved', '842K', NOW() - INTERVAL '12 days')

ON CONFLICT (id) DO NOTHING;

-- Create sample user profiles for ratings
INSERT INTO public.profiles (user_id, username, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440100'::uuid, 'SafeGamer1', NOW() - INTERVAL '90 days'),
('550e8400-e29b-41d4-a716-446655440101'::uuid, 'FamilyFriend', NOW() - INTERVAL '85 days'),
('550e8400-e29b-41d4-a716-446655440102'::uuid, 'KidsFirst', NOW() - INTERVAL '80 days')
ON CONFLICT (user_id) DO NOTHING;

-- Add sample ratings to make games look active
INSERT INTO public.game_ratings (game_id, user_id, honesty, safety, fairness, age_appropriate, created_at) VALUES
-- METALLIX ratings
('550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440100'::uuid, 5, 5, 5, 5, NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440101'::uuid, 4, 5, 4, 5, NOW() - INTERVAL '20 days'),

-- MeepCity ratings
('550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440100'::uuid, 4, 5, 4, 5, NOW() - INTERVAL '40 days'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440102'::uuid, 5, 5, 5, 5, NOW() - INTERVAL '35 days'),

-- Jailbreak ratings
('550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440101'::uuid, 4, 4, 5, 4, NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440102'::uuid, 5, 4, 4, 4, NOW() - INTERVAL '16 days'),

-- Adopt Me! ratings
('550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440100'::uuid, 3, 5, 3, 5, NOW() - INTERVAL '55 days'),
('550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440101'::uuid, 4, 5, 4, 5, NOW() - INTERVAL '50 days'),

-- Brookhaven RP ratings
('550e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440100'::uuid, 5, 5, 5, 5, NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440102'::uuid, 4, 5, 4, 5, NOW() - INTERVAL '7 days'),

-- Arsenal ratings
('550e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440101'::uuid, 4, 3, 5, 3, NOW() - INTERVAL '15 days'),

-- Tower Defense ratings
('550e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440100'::uuid, 5, 4, 5, 4, NOW() - INTERVAL '10 days')

ON CONFLICT (game_id, user_id) DO NOTHING;

-- Verify the results
SELECT
    COUNT(*) as total_games,
    COUNT(*) FILTER (WHERE verified = true) as verified_games,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_games
FROM public.games;

-- Show sample of games with ratings
SELECT
    title,
    developer,
    genre,
    verified,
    safety_score,
    rating_count
FROM public.games_with_ratings
ORDER BY safety_score DESC
LIMIT 8;
