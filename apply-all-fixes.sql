-- Combined fix for all authentication issues
-- Run this in your Supabase SQL editor

-- ============================================================================
-- FIX 1: Update handle_new_user trigger to allow OAuth users without username
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username text;
BEGIN
  -- Get username from metadata
  v_username := trim(new.raw_user_meta_data ->> 'username');
  
  -- If username is missing (common for OAuth providers like Google),
  -- skip automatic profile creation. The user will create their profile
  -- manually via the username dialog in the frontend.
  IF v_username IS NULL OR v_username = '' THEN
    -- Skip profile creation - user will create it manually via frontend dialog
    RETURN new;
  END IF;
  
  -- Validate username length
  IF length(v_username) < 3 OR length(v_username) > 20 THEN
    RAISE EXCEPTION 'Username must be between 3 and 20 characters';
  END IF;
  
  -- Validate username format
  IF v_username !~ '^[a-zA-Z0-9_]+$' THEN
    RAISE EXCEPTION 'Username can only contain letters, numbers, and underscores';
  END IF;
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, username)
  VALUES (new.id, v_username);
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already exists';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating profile: %', SQLERRM;
END;
$$;

-- ============================================================================
-- FIX 2: Ensure RLS policies allow users to create/update their own profiles
-- ============================================================================

-- Drop and recreate the insert policy to ensure it's correct
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Also ensure users can update their own profile (for upsert operations)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Verification: Check that policies exist
-- ============================================================================
-- You can run this to verify:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
