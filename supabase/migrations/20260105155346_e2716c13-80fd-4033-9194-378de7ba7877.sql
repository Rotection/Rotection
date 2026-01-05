-- Update handle_new_user function with proper validation and error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username text;
BEGIN
  -- Validate username from metadata
  v_username := trim(new.raw_user_meta_data ->> 'username');
  
  -- Check if username is provided
  IF v_username IS NULL OR v_username = '' THEN
    RAISE EXCEPTION 'Username is required';
  END IF;
  
  -- Check length constraints
  IF length(v_username) < 3 OR length(v_username) > 20 THEN
    RAISE EXCEPTION 'Username must be between 3 and 20 characters';
  END IF;
  
  -- Check character constraints (alphanumeric and underscores only)
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

-- Add CHECK constraint on profiles table for defense in depth
ALTER TABLE public.profiles 
ADD CONSTRAINT username_length CHECK (length(username) >= 3 AND length(username) <= 20);

ALTER TABLE public.profiles 
ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$');