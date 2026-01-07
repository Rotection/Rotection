-- Migration: Create dynamic system with real data storage
-- This migration creates all tables for games, ratings, reviews, reports, and submissions

-- ============================================================================
-- 1. GAMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roblox_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    developer TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    roblox_url TEXT NOT NULL,
    genre TEXT,
    age_rating TEXT DEFAULT '7+',
    verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    total_plays TEXT DEFAULT '0',
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. GAME RATINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    honesty INTEGER CHECK (honesty >= 1 AND honesty <= 5) NOT NULL,
    safety INTEGER CHECK (safety >= 1 AND safety <= 5) NOT NULL,
    fairness INTEGER CHECK (fairness >= 1 AND fairness <= 5) NOT NULL,
    age_appropriate INTEGER CHECK (age_appropriate >= 1 AND age_appropriate <= 5) NOT NULL,
    overall_rating DECIMAL(2,1) GENERATED ALWAYS AS ((honesty + safety + fairness + age_appropriate)::decimal / 4) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure one rating per user per game
    UNIQUE(game_id, user_id)
);

-- ============================================================================
-- 3. GAME REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating_id UUID REFERENCES public.game_ratings(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 1000),
    helpful_count INTEGER DEFAULT 0,
    unhelpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. REVIEW HELPFULNESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.review_helpfulness (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID REFERENCES public.game_reviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure one vote per user per review
    UNIQUE(review_id, user_id)
);

-- ============================================================================
-- 5. GAME REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) >= 10),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. GAME SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roblox_url TEXT NOT NULL,
    roblox_id TEXT,
    title TEXT,
    developer TEXT,
    description TEXT,
    thumbnail_url TEXT,
    genre TEXT,
    submitter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Games indexes
CREATE INDEX IF NOT EXISTS games_roblox_id_idx ON public.games (roblox_id);
CREATE INDEX IF NOT EXISTS games_status_idx ON public.games (status);
CREATE INDEX IF NOT EXISTS games_genre_idx ON public.games (genre);
CREATE INDEX IF NOT EXISTS games_verified_idx ON public.games (verified);

-- Ratings indexes
CREATE INDEX IF NOT EXISTS game_ratings_game_id_idx ON public.game_ratings (game_id);
CREATE INDEX IF NOT EXISTS game_ratings_user_id_idx ON public.game_ratings (user_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS game_reviews_game_id_idx ON public.game_reviews (game_id);
CREATE INDEX IF NOT EXISTS game_reviews_user_id_idx ON public.game_reviews (user_id);

-- Reports indexes
CREATE INDEX IF NOT EXISTS game_reports_game_id_idx ON public.game_reports (game_id);
CREATE INDEX IF NOT EXISTS game_reports_status_idx ON public.game_reports (status);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS game_submissions_status_idx ON public.game_submissions (status);
CREATE INDEX IF NOT EXISTS game_submissions_submitter_idx ON public.game_submissions (submitter_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- GAMES POLICIES
DROP POLICY IF EXISTS "Games are viewable by everyone" ON public.games;
CREATE POLICY "Games are viewable by everyone" ON public.games
    FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Users can insert games" ON public.games;
CREATE POLICY "Users can insert games" ON public.games
    FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- RATINGS POLICIES
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.game_ratings;
CREATE POLICY "Ratings are viewable by everyone" ON public.game_ratings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own ratings" ON public.game_ratings;
CREATE POLICY "Users can insert their own ratings" ON public.game_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ratings" ON public.game_ratings;
CREATE POLICY "Users can update their own ratings" ON public.game_ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- REVIEWS POLICIES
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.game_reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.game_reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.game_reviews;
CREATE POLICY "Users can insert their own reviews" ON public.game_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.game_reviews;
CREATE POLICY "Users can update their own reviews" ON public.game_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- HELPFULNESS POLICIES
DROP POLICY IF EXISTS "Helpfulness votes are viewable by everyone" ON public.review_helpfulness;
CREATE POLICY "Helpfulness votes are viewable by everyone" ON public.review_helpfulness
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can vote on helpfulness" ON public.review_helpfulness;
CREATE POLICY "Users can vote on helpfulness" ON public.review_helpfulness
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their helpfulness votes" ON public.review_helpfulness;
CREATE POLICY "Users can update their helpfulness votes" ON public.review_helpfulness
    FOR UPDATE USING (auth.uid() = user_id);

-- REPORTS POLICIES
DROP POLICY IF EXISTS "Users can view their own reports" ON public.game_reports;
CREATE POLICY "Users can view their own reports" ON public.game_reports
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert reports" ON public.game_reports;
CREATE POLICY "Users can insert reports" ON public.game_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.game_submissions;
CREATE POLICY "Users can view their own submissions" ON public.game_submissions
    FOR SELECT USING (auth.uid() = submitter_id);

DROP POLICY IF EXISTS "Users can insert submissions" ON public.game_submissions;
CREATE POLICY "Users can insert submissions" ON public.game_submissions
    FOR INSERT WITH CHECK (auth.uid() = submitter_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Games trigger
DROP TRIGGER IF EXISTS update_games_updated_at ON public.games;
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ratings trigger
DROP TRIGGER IF EXISTS update_game_ratings_updated_at ON public.game_ratings;
CREATE TRIGGER update_game_ratings_updated_at
    BEFORE UPDATE ON public.game_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Reviews trigger
DROP TRIGGER IF EXISTS update_game_reviews_updated_at ON public.game_reviews;
CREATE TRIGGER update_game_reviews_updated_at
    BEFORE UPDATE ON public.game_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Reports trigger
DROP TRIGGER IF EXISTS update_game_reports_updated_at ON public.game_reports;
CREATE TRIGGER update_game_reports_updated_at
    BEFORE UPDATE ON public.game_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Submissions trigger
DROP TRIGGER IF EXISTS update_game_submissions_updated_at ON public.game_submissions;
CREATE TRIGGER update_game_submissions_updated_at
    BEFORE UPDATE ON public.game_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS FOR CALCULATED FIELDS
-- ============================================================================

-- Function to update review helpfulness counts
CREATE OR REPLACE FUNCTION update_review_helpfulness_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the review's helpful/unhelpful counts
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.game_reviews SET
            helpful_count = (
                SELECT COUNT(*) FROM public.review_helpfulness
                WHERE review_id = NEW.review_id AND is_helpful = true
            ),
            unhelpful_count = (
                SELECT COUNT(*) FROM public.review_helpfulness
                WHERE review_id = NEW.review_id AND is_helpful = false
            )
        WHERE id = NEW.review_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE public.game_reviews SET
            helpful_count = (
                SELECT COUNT(*) FROM public.review_helpfulness
                WHERE review_id = OLD.review_id AND is_helpful = true
            ),
            unhelpful_count = (
                SELECT COUNT(*) FROM public.review_helpfulness
                WHERE review_id = OLD.review_id AND is_helpful = false
            )
        WHERE id = OLD.review_id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for helpfulness count updates
DROP TRIGGER IF EXISTS update_review_helpfulness_trigger ON public.review_helpfulness;
CREATE TRIGGER update_review_helpfulness_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.review_helpfulness
    FOR EACH ROW
    EXECUTE FUNCTION update_review_helpfulness_counts();

-- ============================================================================
-- VIEWS FOR EASY QUERYING
-- ============================================================================

-- View for games with calculated ratings
CREATE OR REPLACE VIEW public.games_with_ratings AS
SELECT
    g.*,
    COALESCE(AVG(r.honesty), 0)::decimal(2,1) as avg_honesty,
    COALESCE(AVG(r.safety), 0)::decimal(2,1) as avg_safety,
    COALESCE(AVG(r.fairness), 0)::decimal(2,1) as avg_fairness,
    COALESCE(AVG(r.age_appropriate), 0)::decimal(2,1) as avg_age_appropriate,
    COALESCE(AVG(r.overall_rating), 0)::decimal(2,1) as avg_overall_rating,
    COUNT(r.id)::integer as rating_count,
    -- Calculate safety score (weighted average with emphasis on safety and age_appropriate)
    CASE
        WHEN COUNT(r.id) = 0 THEN 50
        ELSE LEAST(100, GREATEST(0,
            ROUND((AVG(r.safety) * 0.4 + AVG(r.age_appropriate) * 0.3 + AVG(r.honesty) * 0.2 + AVG(r.fairness) * 0.1) * 20)
        ))
    END::integer as safety_score
FROM public.games g
LEFT JOIN public.game_ratings r ON g.id = r.game_id
WHERE g.status = 'approved'
GROUP BY g.id;

-- View for reviews with user info
CREATE OR REPLACE VIEW public.reviews_with_users AS
SELECT
    r.*,
    p.username as author_username,
    rt.overall_rating as rating
FROM public.game_reviews r
JOIN public.profiles p ON r.user_id = p.user_id
LEFT JOIN public.game_ratings rt ON r.rating_id = rt.id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.games IS 'Approved games available on the platform';
COMMENT ON TABLE public.game_ratings IS 'User ratings for games across different criteria';
COMMENT ON TABLE public.game_reviews IS 'User reviews and comments for games';
COMMENT ON TABLE public.review_helpfulness IS 'Votes on whether reviews are helpful';
COMMENT ON TABLE public.game_reports IS 'Reports about problematic games';
COMMENT ON TABLE public.game_submissions IS 'User submissions of new games for approval';

COMMENT ON VIEW public.games_with_ratings IS 'Games with calculated average ratings and safety scores';
COMMENT ON VIEW public.reviews_with_users IS 'Reviews joined with user profile information';
