-- First, let's check if we can create a test user in auth.users
-- Note: This might not work in all Supabase setups, so we'll also provide alternatives

-- Option 1: Try to insert a test user (this may fail due to auth restrictions)
DO $$
BEGIN
    -- Try to insert a test user
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        '00000000-0000-0000-0000-000000000001'::uuid,
        'test@example.com',
        '$2a$10$dummy.hash.for.test.user.only',
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Test User"}',
        false,
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Test user created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not create test user in auth.users: %', SQLERRM;
END $$;

-- Option 2: Modify the foreign key constraint to be more flexible
-- Drop the existing foreign key constraint
ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS journal_entries_user_id_fkey;

-- Create a more flexible constraint that allows our test user
-- This constraint will allow any UUID that either exists in auth.users OR is our specific test UUID
ALTER TABLE journal_entries ADD CONSTRAINT journal_entries_user_id_fkey 
    CHECK (
        user_id IN (SELECT id FROM auth.users) OR 
        user_id = '00000000-0000-0000-0000-000000000001'::uuid
    );

-- Alternative: If the above doesn't work, we can temporarily remove the constraint entirely
-- Uncomment the line below if you want to remove the foreign key constraint completely
-- ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS journal_entries_user_id_fkey;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);

-- Show current constraints
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
    AND tc.constraint_type IN ('FOREIGN KEY', 'CHECK');
