-- Remove the foreign key constraint that's causing issues
-- This allows us to use test users without them existing in auth.users

-- First, let's see what constraints exist
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'journal_entries' 
    AND tc.constraint_type = 'FOREIGN KEY';

-- Remove the foreign key constraint
ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS journal_entries_user_id_fkey;

-- Remove any other potential foreign key constraints on user_id
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    FOR constraint_name IN 
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE tc.table_name = 'journal_entries' 
            AND tc.constraint_type = 'FOREIGN KEY'
            AND kcu.column_name = 'user_id'
    LOOP
        EXECUTE 'ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
END $$;

-- Remove any existing check constraints on user_id
ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS journal_entries_user_id_uuid_check;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);

-- Verify the constraints after removal
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_name = 'journal_entries' 
    AND kcu.column_name = 'user_id';

-- Show table structure to confirm
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'journal_entries' 
ORDER BY ordinal_position;
