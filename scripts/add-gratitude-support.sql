-- Add support for different journal types including gratitude
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'general';
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS gratitude_items TEXT[] DEFAULT '{}';

-- Update existing entries to be 'general' type
UPDATE journal_entries SET entry_type = 'general' WHERE entry_type IS NULL;

-- Create index for entry type
CREATE INDEX IF NOT EXISTS idx_journal_entries_type ON journal_entries(user_id, entry_type, created_at DESC);

-- Success message
SELECT 'Gratitude journal support added successfully! 🙏✨' as message;
