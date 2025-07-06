-- Fix profiles table id column to have default UUID
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();