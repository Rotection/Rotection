-- Migration: Add OAuth fields to profiles table
-- This migration adds support for Roblox OAuth and improves the profiles table structure

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS provider TEXT,
ADD COLUMN IF NOT EXISTS roblox_user_id TEXT,
ADD COLUMN IF NOT EXISTS roblox_username TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create unique index on roblox_user_id to prevent duplicate Roblox accounts
CREATE UNIQUE INDEX IF NOT EXISTS profiles_roblox_user_id_unique
ON profiles (roblox_user_id)
WHERE roblox_user_id IS NOT NULL;

-- Create index on provider for efficient lookups
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON profiles (provider);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for the new fields
-- Users can read all profiles (for public display)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comment to document the new fields
COMMENT ON COLUMN profiles.provider IS 'OAuth provider used for authentication (google, roblox, etc.)';
COMMENT ON COLUMN profiles.roblox_user_id IS 'Roblox user ID for linked accounts';
COMMENT ON COLUMN profiles.roblox_username IS 'Roblox username for linked accounts';
COMMENT ON COLUMN profiles.avatar_url IS 'User avatar URL from OAuth provider';
