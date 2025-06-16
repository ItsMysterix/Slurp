-- Fix RLS policies for mood_entries table
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "select_own_entries" ON mood_entries;
DROP POLICY IF EXISTS "insert_own_entries" ON mood_entries;
DROP POLICY IF EXISTS "update_own_entries" ON mood_entries;
DROP POLICY IF EXISTS "delete_own_entries" ON mood_entries;

-- Create more permissive RLS policies for mood_entries
CREATE POLICY "Users can view own mood entries" ON mood_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON mood_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" ON mood_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON mood_entries TO authenticated;
GRANT USAGE ON SEQUENCE mood_entries_id_seq TO authenticated;

-- Alternative: Temporarily disable RLS for mood_entries if policies still don't work
-- Uncomment the line below if you want to disable RLS temporarily
-- ALTER TABLE mood_entries DISABLE ROW LEVEL SECURITY;

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'mood_entries';
