-- This script applies the fix for Google OAuth trigger issue
-- Run this in your Supabase SQL editor or via CLI: supabase db execute < apply-migration.sql

-- Fix handle_new_user function to allow OAuth providers (like Google) that don't provide username
-- OAuth users will create their profile manually via the username dialog
-- This allows Google OAuth signups to succeed even without a username in metadata
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
