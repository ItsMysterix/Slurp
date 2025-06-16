-- Fix weekly_goals table structure
DO $$
BEGIN
    -- Check if weekly_goals table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'weekly_goals') THEN
        -- Add week_start column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'weekly_goals' AND column_name = 'week_start') THEN
            ALTER TABLE weekly_goals ADD COLUMN week_start DATE NOT NULL DEFAULT CURRENT_DATE;
            RAISE NOTICE 'Added week_start column to weekly_goals table';
        END IF;
        
        -- Add updated_at column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'weekly_goals' AND column_name = 'updated_at') THEN
            ALTER TABLE weekly_goals ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added updated_at column to weekly_goals table';
        END IF;
        
        -- Update existing records to have proper week_start values
        UPDATE weekly_goals 
        SET week_start = DATE_TRUNC('week', created_at)::DATE
        WHERE week_start IS NULL OR week_start = CURRENT_DATE;
        
        -- Create unique constraint on user_id and week_start
        DO $$
        BEGIN
            ALTER TABLE weekly_goals ADD CONSTRAINT unique_user_week UNIQUE (user_id, week_start);
        EXCEPTION
            WHEN duplicate_table THEN
                RAISE NOTICE 'Constraint unique_user_week already exists';
        END $$;
        
        RAISE NOTICE 'Fixed weekly_goals table structure';
    ELSE
        -- Create the table from scratch if it doesn't exist
        CREATE TABLE weekly_goals (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            mood_id TEXT NOT NULL,
            mood_name TEXT NOT NULL,
            target_count INTEGER DEFAULT 3,
            week_start DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, week_start)
        );
        
        -- Enable RLS
        ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own weekly goals" ON weekly_goals
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert their own weekly goals" ON weekly_goals
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can update their own weekly goals" ON weekly_goals
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete their own weekly goals" ON weekly_goals
            FOR DELETE USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Created weekly_goals table with proper structure';
    END IF;
END $$;

-- Fix daily_challenges table structure
DO $$
BEGIN
    -- Check if daily_challenges table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'daily_challenges') THEN
        -- Add challenge_text column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_challenges' AND column_name = 'challenge_text') THEN
            ALTER TABLE daily_challenges ADD COLUMN challenge_text TEXT;
            RAISE NOTICE 'Added challenge_text column to daily_challenges table';
        END IF;
        
        -- Add completed column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_challenges' AND column_name = 'completed') THEN
            ALTER TABLE daily_challenges ADD COLUMN completed BOOLEAN DEFAULT FALSE;
            RAISE NOTICE 'Added completed column to daily_challenges table';
        END IF;
        
        -- Add completed_at column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'daily_challenges' AND column_name = 'completed_at') THEN
            ALTER TABLE daily_challenges ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Added completed_at column to daily_challenges table';
        END IF;
        
        RAISE NOTICE 'Fixed daily_challenges table structure';
    ELSE
        -- Create the table from scratch if it doesn't exist
        CREATE TABLE daily_challenges (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            challenge_date DATE NOT NULL,
            challenge_text TEXT,
            completed BOOLEAN DEFAULT FALSE,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, challenge_date)
        );
        
        -- Enable RLS
        ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own daily challenges" ON daily_challenges
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert their own daily challenges" ON daily_challenges
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can update their own daily challenges" ON daily_challenges
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete their own daily challenges" ON daily_challenges
            FOR DELETE USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Created daily_challenges table with proper structure';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_goals_user_week ON weekly_goals(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, challenge_date);

-- Verify the structure
DO $$
BEGIN
    RAISE NOTICE 'Weekly goals table columns:';
    FOR rec IN 
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'weekly_goals' 
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  %: % (nullable: %)', rec.column_name, rec.data_type, rec.is_nullable;
    END LOOP;
    
    RAISE NOTICE 'Daily challenges table columns:';
    FOR rec IN 
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'daily_challenges' 
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  %: % (nullable: %)', rec.column_name, rec.data_type, rec.is_nullable;
    END LOOP;
END $$;
