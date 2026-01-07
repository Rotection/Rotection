-- Migration: Seed initial games for demo and testing
-- This migration populates the games table with sample games based on the featured games data

-- ============================================================================
-- INSERT SAMPLE GAMES
-- ============================================================================

-- Note: Using specific UUIDs for consistency, but in real usage these would be auto-generated
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
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '101411193179895',
    '[ METALLIX ] Speedsters Sandbox',
    'Speedsters Sandbox',
    'A safe and fun sandbox game where you can build, race, and explore with friends. Features custom vehicles, building tools, and creative gameplay modes.',
    'https://tr.rbxcdn.com/180DAY-bf6e00c4f61b35b36ea92d828e4c3232/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/101411193179895',
    'Sandbox',
    '5+',
    true,
    'approved',
    '1.2M',
    NOW() - INTERVAL '30 days'
),
(
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '142823291',
    'MeepCity',
    'alexnewtron',
    'A social hangout game where you can customize your estate, adopt pets, and make friends. Family-friendly environment with moderated chat.',
    'https://tr.rbxcdn.com/180DAY-c15c7e5c2e51a96f9e71fd99ad7e8484/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/142823291',
    'Social',
    '5+',
    true,
    'approved',
    '8.5M',
    NOW() - INTERVAL '45 days'
),
(
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    '606849621',
    'Jailbreak',
    'Badimo',
    'Team up with friends to escape prison or stop criminals as a police officer. Features vehicles, heists, and cooperative gameplay with fair monetization.',
    'https://tr.rbxcdn.com/180DAY-7b4c4f89b3a4e2a9e2f6f7c8d9e0f1a2/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/606849621',
    'Action',
    '7+',
    true,
    'approved',
    '5.2M',
    NOW() - INTERVAL '20 days'
),
(
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    '292439477',
    'Phantom Forces',
    'StyLiS Studios',
    'A tactical FPS with realistic weapons and competitive gameplay. Features balanced mechanics and skill-based progression.',
    'https://tr.rbxcdn.com/180DAY-8c5d5f9a0c4b4e3a3e7f8c9d0e1f2a3b/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/292439477',
    'FPS',
    '10+',
    true,
    'approved',
    '1.8M',
    NOW() - INTERVAL '15 days'
),
(
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    '920587237',
    'Adopt Me!',
    'DreamCraft',
    'Raise and care for virtual pets in this wholesome adoption game. Trade pets, decorate your house, and play mini-games.',
    'https://tr.rbxcdn.com/180DAY-9d6e6f0a1b5c5f4a4f8f9c0d1e2f3a4c/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/920587237',
    'Simulation',
    '5+',
    true,
    'approved',
    '28.9M',
    NOW() - INTERVAL '60 days'
),
(
    '550e8400-e29b-41d4-a716-446655440006'::uuid,
    '746820961',
    'Brookhaven RP',
    'Wolfpaq',
    'Role-play in a peaceful town with houses, cars, and jobs. Family-friendly environment with creative storytelling opportunities.',
    'https://tr.rbxcdn.com/180DAY-ae7f7f1a2b6d6f5a5f9f0c1d2e3f4a5d/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/746820961',
    'RPG',
    '5+',
    true,
    'approved',
    '15.3M',
    NOW() - INTERVAL '10 days'
),
(
    '550e8400-e29b-41d4-a716-446655440007'::uuid,
    '537413528',
    'Build A Boat For Treasure',
    'Chillz Studios',
    'Build creative boats and navigate through challenging obstacles to reach treasure. Encourages engineering thinking and creativity.',
    'https://tr.rbxcdn.com/180DAY-bf8f8f2a3b7e7f6a6f0f1c2d3e4f5a6e/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/537413528',
    'Building',
    '7+',
    true,
    'approved',
    '2.1M',
    NOW() - INTERVAL '25 days'
),
(
    '550e8400-e29b-41d4-a716-446655440008'::uuid,
    '189707',
    'Natural Disaster Survival',
    'Stickmasterluke',
    'Survive various natural disasters in this classic survival game. Tests quick thinking and cooperation skills.',
    'https://tr.rbxcdn.com/180DAY-cf9f9f3a4b8f8f7a7f1f2c3d4e5f6a7f/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/189707',
    'Survival',
    '7+',
    true,
    'approved',
    '3.4M',
    NOW() - INTERVAL '40 days'
),
(
    '550e8400-e29b-41d4-a716-446655440009'::uuid,
    '155615604',
    'Prison Life',
    'Aesthetical',
    'Classic prison escape game with team-based gameplay. Choose to be a prisoner or guard in this strategic game.',
    'https://tr.rbxcdn.com/180DAY-df0f0f4a5b9f9f8a8f2f3c4d5e6f7a8f/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/155615604',
    'Action',
    '10+',
    false,
    'approved',
    '967K',
    NOW() - INTERVAL '35 days'
),
(
    '550e8400-e29b-41d4-a716-446655440010'::uuid,
    '286090429',
    'Arsenal',
    'ROLVe Community',
    'Fast-paced FPS with rotating weapons and competitive matches. Features skill-based gameplay and fair progression.',
    'https://tr.rbxcdn.com/180DAY-ef1f1f5a6b0f0f9a9f3f4c5d6e7f8a9f/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/286090429',
    'FPS',
    '10+',
    true,
    'approved',
    '1.9M',
    NOW() - INTERVAL '18 days'
),
(
    '550e8400-e29b-41d4-a716-446655440011'::uuid,
    '2753915549',
    'Bloxburg',
    'Coeptus',
    'Life simulation game where you can build houses, get jobs, and live a virtual life. Premium game with high-quality content.',
    'https://tr.rbxcdn.com/180DAY-ff2f2f6a7b1f1f0a0f4f5c6d7e8f9a0f/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/2753915549',
    'Simulation',
    '7+',
    true,
    'approved',
    '6.8M',
    NOW() - INTERVAL '22 days'
),
(
    '550e8400-e29b-41d4-a716-446655440012'::uuid,
    '4282985734',
    'Tower Defense Simulator',
    'Paradoxum Games',
    'Strategic tower defense game with cooperative multiplayer. Features balanced gameplay and regular updates.',
    'https://tr.rbxcdn.com/180DAY-103f3f7a8b2f2f1a1f5f6c7d8e9f0a1f/768/432/Image/Webp/noFilter',
    'https://www.roblox.com/games/4282985734',
    'Strategy',
    '7+',
    true,
    'approved',
    '842K',
    NOW() - INTERVAL '12 days'
);

-- ============================================================================
-- INSERT SAMPLE RATINGS
-- ============================================================================

-- Sample ratings for the first few games to show the rating system works
-- Using a system user ID for consistency (in production, these would come from real users)
DO $$
DECLARE
    sample_user_id UUID := '550e8400-e29b-41d4-a716-446655440100'::uuid;
    sample_user_id_2 UUID := '550e8400-e29b-41d4-a716-446655440101'::uuid;
    sample_user_id_3 UUID := '550e8400-e29b-41d4-a716-446655440102'::uuid;
BEGIN
    -- Create sample profiles first (simplified for demo)
    INSERT INTO public.profiles (user_id, username, created_at) VALUES
        (sample_user_id, 'DemoUser1', NOW() - INTERVAL '90 days'),
        (sample_user_id_2, 'DemoUser2', NOW() - INTERVAL '85 days'),
        (sample_user_id_3, 'DemoUser3', NOW() - INTERVAL '80 days')
    ON CONFLICT (user_id) DO NOTHING;

    -- Ratings for METALLIX Speedsters Sandbox
    INSERT INTO public.game_ratings (game_id, user_id, honesty, safety, fairness, age_appropriate, created_at) VALUES
        ('550e8400-e29b-41d4-a716-446655440001'::uuid, sample_user_id, 5, 5, 5, 5, NOW() - INTERVAL '25 days'),
        ('550e8400-e29b-41d4-a716-446655440001'::uuid, sample_user_id_2, 4, 5, 4, 5, NOW() - INTERVAL '20 days'),
        ('550e8400-e29b-41d4-a716-446655440001'::uuid, sample_user_id_3, 5, 4, 5, 4, NOW() - INTERVAL '15 days');

    -- Ratings for MeepCity
    INSERT INTO public.game_ratings (game_id, user_id, honesty, safety, fairness, age_appropriate, created_at) VALUES
        ('550e8400-e29b-41d4-a716-446655440002'::uuid, sample_user_id, 4, 5, 4, 5, NOW() - INTERVAL '40 days'),
        ('550e8400-e29b-41d4-a716-446655440002'::uuid, sample_user_id_2, 5, 5, 5, 5, NOW() - INTERVAL '35 days');

    -- Ratings for Jailbreak
    INSERT INTO public.game_ratings (game_id, user_id, honesty, safety, fairness, age_appropriate, created_at) VALUES
        ('550e8400-e29b-41d4-a716-446655440003'::uuid, sample_user_id, 4, 4, 5, 4, NOW() - INTERVAL '18 days'),
        ('550e8400-e29b-41d4-a716-446655440003'::uuid, sample_user_id_3, 5, 4, 4, 4, NOW() - INTERVAL '16 days');

    -- Ratings for Adopt Me!
    INSERT INTO public.game_ratings (game_id, user_id, honesty, safety, fairness, age_appropriate, created_at) VALUES
        ('550e8400-e29b-41d4-a716-446655440005'::uuid, sample_user_id, 3, 5, 3, 5, NOW() - INTERVAL '55 days'),
        ('550e8400-e29b-41d4-a716-446655440005'::uuid, sample_user_id_2, 4, 5, 4, 5, NOW() - INTERVAL '50 days'),
        ('550e8400-e29b-41d4-a716-446655440005'::uuid, sample_user_id_3, 4, 4, 4, 5, NOW() - INTERVAL '45 days');

    -- Ratings for Brookhaven RP
    INSERT INTO public.game_ratings (game_id, user_id, honesty, safety, fairness, age_appropriate, created_at) VALUES
        ('550e8400-e29b-41d4-a716-446655440006'::uuid, sample_user_id, 5, 5, 5, 5, NOW() - INTERVAL '8 days'),
        ('550e8400-e29b-41d4-a716-446655440006'::uuid, sample_user_id_2, 4, 5, 4, 5, NOW() - INTERVAL '7 days');
END $$;

-- ============================================================================
-- INSERT SAMPLE REVIEWS
-- ============================================================================

-- Sample reviews to showcase the review system
DO $$
DECLARE
    sample_user_id UUID := '550e8400-e29b-41d4-a716-446655440100'::uuid;
    sample_user_id_2 UUID := '550e8400-e29b-41d4-a716-446655440101'::uuid;
    sample_user_id_3 UUID := '550e8400-e29b-41d4-a716-446655440102'::uuid;
    rating_1 UUID;
    rating_2 UUID;
    rating_3 UUID;
BEGIN
    -- Get rating IDs for reviews
    SELECT id INTO rating_1 FROM public.game_ratings
    WHERE game_id = '550e8400-e29b-41d4-a716-446655440001'::uuid AND user_id = sample_user_id;

    SELECT id INTO rating_2 FROM public.game_ratings
    WHERE game_id = '550e8400-e29b-41d4-a716-446655440002'::uuid AND user_id = sample_user_id_2;

    SELECT id INTO rating_3 FROM public.game_ratings
    WHERE game_id = '550e8400-e29b-41d4-a716-446655440006'::uuid AND user_id = sample_user_id;

    -- Insert sample reviews
    INSERT INTO public.game_reviews (game_id, user_id, rating_id, content, created_at) VALUES
        ('550e8400-e29b-41d4-a716-446655440001'::uuid, sample_user_id, rating_1,
         'Amazing sandbox game! My kids love building vehicles and the community is very friendly. Great for creative play and the moderation keeps everything safe.',
         NOW() - INTERVAL '24 days'),
        ('550e8400-e29b-41d4-a716-446655440002'::uuid, sample_user_id_2, rating_2,
         'Perfect social game for families. The estate customization is fun and the pet adoption system teaches responsibility. Highly recommended!',
         NOW() - INTERVAL '34 days'),
        ('550e8400-e29b-41d4-a716-446655440006'::uuid, sample_user_id, rating_3,
         'Brookhaven is great for role-playing with friends. The town is well-designed and there are lots of activities. Very wholesome experience.',
         NOW() - INTERVAL '7 days');
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.games IS 'Now contains sample games for testing and demonstration';
