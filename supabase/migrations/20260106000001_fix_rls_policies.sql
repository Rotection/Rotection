-- Fix RLS policies to allow users to create their own profile
-- The existing policy should work, but let's ensure it's correct and add better error handling

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
