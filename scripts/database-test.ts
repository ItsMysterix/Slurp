// Simple database connection test
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...")

  try {
    // Test basic connection
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      console.error("❌ Database connection failed:", error.message)
      return false
    }

    console.log("✅ Database connection successful!")

    // Test table structure
    const tables = [
      "profiles",
      "mood_entries",
      "journal_entries",
      "weekly_goals",
      "daily_challenges",
      "exercise_usage",
      "resources",
      "bookmarked_resources",
    ]

    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select("*").limit(1)
      if (tableError) {
        console.error(`❌ Table ${table} error:`, tableError.message)
      } else {
        console.log(`✅ Table ${table} is accessible`)
      }
    }

    return true
  } catch (error) {
    console.error("❌ Connection test failed:", error)
    return false
  }
}

testDatabaseConnection()
