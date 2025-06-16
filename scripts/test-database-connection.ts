import { createClient } from "@supabase/supabase-js"

console.log("🔌 Testing Supabase Database Connection...\n")

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ Missing environment variables!")
  console.log("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log("🔍 Testing basic connection...")

    // Test basic connection
    const { data, error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      console.log("❌ Connection failed:", error.message)
      return
    }

    console.log("✅ Connection successful!")
    console.log(`📊 Profiles table has ${data} records`)

    // Test mood_entries table
    console.log("\n🔍 Testing mood_entries table...")
    const { data: moodData, error: moodError } = await supabase
      .from("mood_entries")
      .select("count", { count: "exact", head: true })

    if (moodError) {
      console.log("❌ mood_entries table error:", moodError.message)
    } else {
      console.log("✅ mood_entries table accessible!")
      console.log(`📊 Mood entries table has ${moodData} records`)
    }

    console.log("\n🎉 Database connection test completed!")
  } catch (error) {
    console.log("❌ Unexpected error:", error)
  }
}

testConnection()
