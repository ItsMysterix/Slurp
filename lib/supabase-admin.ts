import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we have the service role key
const hasServiceKey = supabaseServiceKey && supabaseServiceKey.length > 0

// Only create admin client if we have the service key
export const supabaseAdmin = hasServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Function to create profile using admin client
export async function createUserProfileAdmin(userId: string, email: string) {
  try {
    if (!supabaseAdmin) {
      console.log("⚠️ No service role key available, cannot use admin client")
      return null
    }

    console.log("🔧 Creating profile with admin client for user:", userId)

    const newProfile = {
      id: userId,
      username: email.split("@")[0],
      name: email.split("@")[0],
      profile_icon: "🍓",
      anonymous_mode: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("profiles").insert([newProfile]).select().single()

    if (error) {
      console.error("❌ Admin profile creation failed:", error)
      return null
    }

    console.log("✅ Profile created successfully with admin client")
    return data
  } catch (error) {
    console.error("❌ Error in createUserProfileAdmin:", error)
    return null
  }
}

// Function to create mood entry using admin client (bypasses RLS)
export async function createMoodEntryAdmin(userId: string, moodData: any) {
  try {
    if (!supabaseAdmin) {
      console.log("⚠️ No service role key available, cannot use admin client for mood entry")
      return null
    }

    console.log("🔧 Creating mood entry with admin client for user:", userId)

    const newMoodEntry = {
      user_id: userId,
      ...moodData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("mood_entries").insert([newMoodEntry]).select().single()

    if (error) {
      console.error("❌ Admin mood entry creation failed:", error)
      return null
    }

    console.log("✅ Mood entry created successfully with admin client")
    return data
  } catch (error) {
    console.error("❌ Error in createMoodEntryAdmin:", error)
    return null
  }
}

// Check if admin client is available
export function isAdminClientAvailable(): boolean {
  return !!supabaseAdmin
}
