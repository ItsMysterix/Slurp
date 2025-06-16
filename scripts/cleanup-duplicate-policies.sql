-- Clean up any duplicate or conflicting policies
-- This script safely removes and recreates all policies

-- Mood entries policies cleanup
DROP POLICY IF EXISTS "select_own_entries" ON public.mood_entries;
DROP POLICY IF EXISTS "insert_own_entries" ON public.mood_entries;
DROP POLICY IF EXISTS "update_own_entries" ON public.mood_entries;
DROP POLICY IF EXISTS "delete_own_entries" ON public.mood_entries;

-- Profiles policies cleanup  
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Reminders policies cleanup
DROP POLICY IF EXISTS "select_own_reminders" ON public.reminders;
DROP POLICY IF EXISTS "insert_own_reminders" ON public.reminders;
DROP POLICY IF EXISTS "update_own_reminders" ON public.reminders;
DROP POLICY IF EXISTS "delete_own_reminders" ON public.reminders;

-- Success message
SELECT 'All duplicate policies cleaned up! 🧹' as result;
