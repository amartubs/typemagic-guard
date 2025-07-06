-- Remove foreign key constraint from profiles table to allow independent profile creation
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Also remove the trigger that creates profiles automatically on auth user creation
-- since we're now creating profiles independently
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;