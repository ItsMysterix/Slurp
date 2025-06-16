-- Slurp Database Setup - Complete Schema
-- This script creates all tables, policies, and sample data needed for the Slurp app

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in correct order (handle dependencies)
DROP TABLE IF EXISTS bookmarked_resources CASCADE;
DROP TABLE IF EXISTS exercise_usage CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS weekly_goals CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS mood_entries CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. PROFILES TABLE
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    name TEXT,
    profile_icon TEXT DEFAULT 'strawberry-bliss',
    anonymous_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MOOD ENTRIES TABLE
CREATE TABLE mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mood_name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    emotion TEXT NOT NULL,
    note TEXT,
    bg_color TEXT NOT NULL,
    location TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JOURNAL ENTRIES TABLE
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT DEFAULT 'Untitled Entry',
    content TEXT NOT NULL,
    selected_fruits TEXT[] DEFAULT '{}',
    analyzed_emotions JSONB DEFAULT '{}',
    overall_energy_level INTEGER DEFAULT 50,
    ai_insights TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WEEKLY GOALS TABLE
CREATE TABLE weekly_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mood_id TEXT NOT NULL,
    mood_name TEXT NOT NULL,
    target_count INTEGER DEFAULT 3,
    week_start DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- 5. DAILY CHALLENGES TABLE
CREATE TABLE daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    challenge_date DATE NOT NULL,
    challenge_text TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_date)
);

-- 6. EXERCISE USAGE TABLE
CREATE TABLE exercise_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    exercise_type TEXT NOT NULL,
    exercise_name TEXT,
    duration_seconds INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RESOURCES TABLE (Public - no user_id)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('emergency', 'coping', 'professional')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    contact_info TEXT,
    available_hours TEXT,
    action_type TEXT NOT NULL CHECK (action_type IN ('call', 'visit', 'view')),
    action_text TEXT NOT NULL,
    icon_emoji TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BOOKMARKED RESOURCES TABLE
CREATE TABLE bookmarked_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_mood_entries_user_created ON mood_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_entries_user_created ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_weekly_goals_user_week ON weekly_goals(user_id, week_start);
CREATE INDEX idx_daily_challenges_user_date ON daily_challenges(user_id, challenge_date);
CREATE INDEX idx_exercise_usage_user_type ON exercise_usage(user_id, exercise_type);
CREATE INDEX idx_bookmarked_resources_user ON bookmarked_resources(user_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_resources ENABLE ROW LEVEL SECURITY;
-- Resources table is public, no RLS needed

-- CREATE RLS POLICIES
-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Mood entries policies
CREATE POLICY "mood_entries_all_own" ON mood_entries FOR ALL USING (auth.uid()::text = user_id::text);

-- Journal entries policies
CREATE POLICY "journal_entries_all_own" ON journal_entries FOR ALL USING (auth.uid()::text = user_id::text);

-- Weekly goals policies
CREATE POLICY "weekly_goals_all_own" ON weekly_goals FOR ALL USING (auth.uid()::text = user_id::text);

-- Daily challenges policies
CREATE POLICY "daily_challenges_all_own" ON daily_challenges FOR ALL USING (auth.uid()::text = user_id::text);

-- Exercise usage policies
CREATE POLICY "exercise_usage_all_own" ON exercise_usage FOR ALL USING (auth.uid()::text = user_id::text);

-- Bookmarked resources policies
CREATE POLICY "bookmarked_resources_all_own" ON bookmarked_resources FOR ALL USING (auth.uid()::text = user_id::text);

-- CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mood_entries_updated_at BEFORE UPDATE ON mood_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_goals_updated_at BEFORE UPDATE ON weekly_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercise_usage_updated_at BEFORE UPDATE ON exercise_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- INSERT SAMPLE RESOURCES
INSERT INTO resources (category, title, description, contact_info, available_hours, action_type, action_text, icon_emoji, bg_color) VALUES
-- Emergency Resources
('emergency', 'Crisis Text Line', 'Free 24/7 support for people in crisis', 'Text HOME to 741741', '24/7', 'call', 'Text HOME', '🆘', 'bg-red-100'),
('emergency', 'National Suicide Prevention Lifeline', 'Free and confidential support 24/7', '988', '24/7', 'call', 'Call 988', '📞', 'bg-red-200'),
('emergency', 'SAMHSA National Helpline', 'Treatment referral and information service', '1-800-662-4357', '24/7', 'call', 'Call SAMHSA', '🏥', 'bg-red-300'),

-- Coping Resources
('coping', 'Headspace', 'Meditation and mindfulness app', 'headspace.com', 'Anytime', 'visit', 'Try Headspace', '🧘', 'bg-green-100'),
('coping', 'Calm', 'Sleep stories and relaxation techniques', 'calm.com', 'Anytime', 'visit', 'Visit Calm', '🌙', 'bg-green-200'),
('coping', 'Breathing Exercises', 'Simple breathing techniques for stress relief', '/breathing-exercise', 'Anytime', 'view', 'Try Exercises', '🫁', 'bg-green-300'),

-- Professional Resources
('professional', 'Psychology Today', 'Find therapists in your area', 'psychologytoday.com', 'Business Hours', 'visit', 'Find Therapist', '👩‍⚕️', 'bg-blue-100'),
('professional', 'BetterHelp', 'Online counseling with licensed professionals', 'betterhelp.com', 'Flexible Hours', 'visit', 'Get Started', '💻', 'bg-blue-200'),
('professional', 'Open Path Collective', 'Affordable therapy sessions $30-$60', 'openpathcollective.org', 'Varies', 'visit', 'Find Care', '💰', 'bg-blue-300');

-- GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- SUCCESS MESSAGE
SELECT 'Slurp database setup completed successfully! 🍹✨' as message;
