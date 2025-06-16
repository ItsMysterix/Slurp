-- Temporarily disable RLS on profiles table to allow profile creation
-- This is a quick fix while we sort out the RLS policies

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Re-enable RLS (commented out for now)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

SELECT 'RLS temporarily disabled on profiles table! 🔓' as result;
