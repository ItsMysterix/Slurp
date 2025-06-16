import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("🔧 Supabase Config:", {
  url: supabaseUrl?.substring(0, 30) + "...",
  hasKey: !!supabaseAnonKey,
})

// Hot-reload safe singleton pattern
let supabase: ReturnType<typeof createClient>

if (!globalThis.__supabase__) {
  console.log("🔧 Creating new Supabase client")
  globalThis.__supabase__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: "slurp-auth-token",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
} else {
  console.log("🔧 Reusing existing Supabase client")
}
supabase = globalThis.__supabase__

// Auth functions
export async function signUp(email: string, password: string) {
  console.log("🔐 signUp called with:", { email, password: "***" })
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log("🔐 signUp result:", { user: data.user?.id, error: error?.message })
    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    console.error("❌ signUp error:", error)
    return { user: null, error }
  }
}

export async function signIn(email: string, password: string) {
  console.log("🔐 signIn called with:", { email, password: "***" })
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log("🔐 signIn result:", {
      user: data.user?.id,
      session: !!data.session,
      error: error?.message,
    })
    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    console.error("❌ signIn error:", error)
    return { user: null, error }
  }
}

export async function signOut() {
  console.log("🔐 signOut called")
  try {
    const { error } = await supabase.auth.signOut()
    console.log("🔐 signOut result:", { error: error?.message })
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("❌ signOut error:", error)
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    console.log("🔐 getCurrentUser result:", {
      user: user?.id,
      email: user?.email,
      error: error?.message,
    })
    if (error) throw error
    return user
  } catch (error) {
    console.error("❌ getCurrentUser error:", error)
    return null
  }
}

export async function getProfile() {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    // Try to get profile, but handle case where table doesn't exist
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      // If table doesn't exist or no profile found, return a default profile
      console.warn("⚠️ Profile table not found or no profile exists, using fallback")
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || null,
        username: user.email?.split("@")[0] || null,
        avatar_url: null,
      }
    }
    return data
  } catch (error) {
    console.error("❌ Error fetching profile:", error)
    // Return fallback profile based on user data
    const user = await getCurrentUser()
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || null,
        username: user.email?.split("@")[0] || null,
        avatar_url: null,
      }
    }
    return null
  }
}

// Mood functions - return data directly
export async function saveMood(moodData: {
  mood_type: string
  fruit_label: string
  notes?: string
}) {
  console.log("💾 saveMood called with:", moodData)
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("moods")
      .insert({
        user_id: user.id,
        mood_type: moodData.mood_type,
        fruit_label: moodData.fruit_label,
        notes: moodData.notes,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    console.log("💾 saveMood result:", { data: !!data, error: error?.message })
    if (error) throw error
    return data
  } catch (error) {
    console.error("❌ saveMood error:", error)
    throw error
  }
}

export async function getMoods(limit = 10) {
  console.log("📊 getMoods called with limit:", limit)
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(limit)

    console.log("📊 getMoods result:", { count: data?.length, error: error?.message })
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("❌ getMoods error:", error)
    return []
  }
}

export { supabase }
