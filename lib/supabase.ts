import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

export interface WeeklyGoal {
  id: string
  user_id: string
  mood_id: string
  mood_name: string
  target_count: number
  week_start: string
  created_at: string
  updated_at: string
}

export interface DailyChallenge {
  id: string
  user_id: string
  challenge_date: string
  challenge_text: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface UserProfile {
  id: string
  username: string | null
  name: string | null
  profile_icon: string | null
  anonymous_mode: boolean
  created_at: string
  updated_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  mood_name: string
  emoji: string
  emotion: string
  note: string | null
  bg_color: string
  location: string | null
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface MoodStats {
  totalEntries: number
  mostUsedMood: string | null
  firstLogDate: string | null
  streakData: Array<{ date: string; mood: string; emoji: string }>
  moodDistribution: Array<{ name: string; value: number; color: string }>
}

export interface Resource {
  id: string
  category: "emergency" | "coping" | "professional"
  title: string
  description: string
  contact_info: string | null
  available_hours: string | null
  action_type: "call" | "visit" | "view"
  action_text: string
  icon_emoji: string
  bg_color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BookmarkedResource {
  id: string
  user_id: string
  resource_id: string
  created_at: string
}

// Enhanced authentication functions
export async function isAuthenticated(): Promise<boolean> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) {
      console.error("Auth check error:", error)
      return false
    }
    return !!session?.user
  } catch (error) {
    console.error("Error checking auth:", error)
    return false
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting current user:", error)
      return null
    }
    return user
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("Sign in error:", error)
      return { data: null, error: error.message }
    }
    console.log("Sign in successful:", data.user?.email)
    return { data, error: null }
  } catch (error: any) {
    console.error("Sign in exception:", error)
    return { data: null, error: error.message }
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error("Sign up error:", error)
      return { data: null, error: error.message }
    }
    console.log("Sign up successful:", data.user?.email)
    return { data, error: null }
  } catch (error: any) {
    console.error("Sign up exception:", error)
    return { data: null, error: error.message }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
      throw error
    }
    console.log("Sign out successful")
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Enhanced profile functions with better error handling
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.log("❌ No authenticated user found")
      return null
    }

    console.log("🔍 Fetching profile for user:", user.id)

    const { data: profiles, error } = await supabase.from("profiles").select("*").eq("id", user.id)

    if (error) {
      console.error("❌ Error fetching profile:", error)

      // Try to create profile if it doesn't exist
      if (error.code === "PGRST116") {
        // No rows returned
        console.log("🆕 No profile found, creating one...")

        const newProfile = {
          id: user.id,
          username: user.email?.split("@")[0] || "user",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          profile_icon: "strawberry-bliss",
          anonymous_mode: false,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single()

        if (createError) {
          console.error("❌ Error creating profile:", createError)
          return createFallbackProfile(user)
        }

        console.log("✅ Profile created successfully")
        return createdProfile
      }

      return createFallbackProfile(user)
    }

    if (!profiles || profiles.length === 0) {
      console.log("🔄 No profiles found, creating fallback")
      return createFallbackProfile(user)
    }

    console.log("✅ Profile found successfully")
    return profiles[0]
  } catch (error) {
    console.error("❌ Error in getUserProfile:", error)
    const user = await getCurrentUser()
    return user ? createFallbackProfile(user) : null
  }
}

function createFallbackProfile(user: any): UserProfile {
  return {
    id: user.id,
    username: user.email?.split("@")[0] || "user",
    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    profile_icon: "strawberry-bliss",
    anonymous_mode: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.log("❌ No authenticated user for profile update")
      return false
    }

    console.log("🔄 Updating profile for user:", user.id)

    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("❌ Error updating profile:", error)
      return false
    }

    console.log("✅ Profile updated successfully")
    return true
  } catch (error) {
    console.error("❌ Error in updateUserProfile:", error)
    return false
  }
}

// Enhanced mood functions with better error handling
export async function getMoodEntries(): Promise<{ success: boolean; data?: MoodEntry[]; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data: moods, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching mood entries:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: moods || [] }
  } catch (error: any) {
    console.error("Error in getMoodEntries:", error)
    return { success: false, error: error.message }
  }
}

export async function addMoodEntry(
  moodData: Omit<MoodEntry, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; data?: MoodEntry; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    console.log("💾 Attempting to save mood entry for user:", user.id)

    const { data: mood, error } = await supabase
      .from("mood_entries")
      .insert([
        {
          user_id: user.id,
          ...moodData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error adding mood entry:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Mood entry created successfully")
    return { success: true, data: mood }
  } catch (error: any) {
    console.error("Error in addMoodEntry:", error)
    return { success: false, error: error.message }
  }
}

export async function updateMoodEntry(
  id: string,
  updates: Partial<MoodEntry>,
): Promise<{ success: boolean; data?: MoodEntry; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data: mood, error } = await supabase
      .from("mood_entries")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating mood entry:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: mood }
  } catch (error: any) {
    console.error("Error in updateMoodEntry:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteMoodEntry(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase.from("mood_entries").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting mood entry:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in deleteMoodEntry:", error)
    return { success: false, error: error.message }
  }
}

// Enhanced mood stats with better calculations
export async function getMoodStats(): Promise<MoodStats> {
  try {
    const user = await getCurrentUser()
    if (!user) return getEmptyMoodStats()

    const { data: moods, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching mood stats:", error)
      return getEmptyMoodStats()
    }

    const totalEntries = moods?.length || 0
    if (totalEntries === 0) return getEmptyMoodStats()

    // Calculate most used mood
    const moodCounts: Record<string, number> = {}
    moods?.forEach((mood) => {
      const emotion = mood.emotion || "Unknown"
      moodCounts[emotion] = (moodCounts[emotion] || 0) + 1
    })

    const mostUsedMood =
      Object.keys(moodCounts).length > 0
        ? Object.keys(moodCounts).reduce((a, b) => (moodCounts[a] > moodCounts[b] ? a : b))
        : null

    const firstLogDate = moods && moods.length > 0 ? moods[moods.length - 1].created_at : null

    // Generate 7-day streak with better date handling
    const streakData = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0) // Normalize to start of day
      const dateStr = date.toISOString().split("T")[0]

      const dayMoods =
        moods?.filter((mood) => {
          const moodDate = new Date(mood.created_at)
          moodDate.setHours(0, 0, 0, 0)
          return moodDate.toISOString().split("T")[0] === dateStr
        }) || []

      // Use the most recent mood of the day, or most positive if multiple
      let dayMood = null
      if (dayMoods.length > 0) {
        dayMood = dayMoods.reduce((best, current) => {
          const positiveEmotions = ["Happy", "Excited", "Grateful", "Peaceful", "Confident", "Energetic"]
          const bestIsPositive = positiveEmotions.includes(best.emotion)
          const currentIsPositive = positiveEmotions.includes(current.emotion)

          if (currentIsPositive && !bestIsPositive) return current
          if (!currentIsPositive && bestIsPositive) return best

          // If both same type, use more recent
          return new Date(current.created_at) > new Date(best.created_at) ? current : best
        })
      }

      streakData.push({
        date: dateStr,
        mood: dayMood?.emotion || "None",
        emoji: dayMood?.emoji || "⚪",
      })
    }

    // Calculate mood distribution with colors
    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: getMoodColor(mood),
    }))

    return {
      totalEntries,
      mostUsedMood,
      firstLogDate,
      streakData,
      moodDistribution,
    }
  } catch (error) {
    console.error("Error in getMoodStats:", error)
    return getEmptyMoodStats()
  }
}

export async function deleteAllMoodData(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const { error } = await supabase.from("mood_entries").delete().eq("user_id", user.id)

    if (error) {
      console.error("Error deleting all mood data:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteAllMoodData:", error)
    return false
  }
}

// Resource functions (keeping existing implementation)
export async function getResources(
  category?: string,
): Promise<{ success: boolean; data?: Resource[]; error?: string }> {
  try {
    let query = supabase.from("resources").select("*").eq("is_active", true).order("created_at", { ascending: true })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data: resources, error } = await query

    if (error) {
      console.error("Error fetching resources:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: resources || [] }
  } catch (error: any) {
    console.error("Error in getResources:", error)
    return { success: false, error: error.message }
  }
}

export async function getBookmarkedResources(): Promise<{ success: boolean; data?: string[]; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data: bookmarks, error } = await supabase
      .from("bookmarked_resources")
      .select("resource_id")
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching bookmarked resources:", error)
      return { success: false, error: error.message }
    }

    const resourceIds = bookmarks?.map((bookmark) => bookmark.resource_id) || []
    return { success: true, data: resourceIds }
  } catch (error: any) {
    console.error("Error in getBookmarkedResources:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleBookmarkResource(
  resourceId: string,
): Promise<{ success: boolean; bookmarked?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Check if already bookmarked
    const { data: existing, error: checkError } = await supabase
      .from("bookmarked_resources")
      .select("id")
      .eq("user_id", user.id)
      .eq("resource_id", resourceId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking bookmark:", checkError)
      return { success: false, error: checkError.message }
    }

    if (existing) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from("bookmarked_resources")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId)

      if (deleteError) {
        console.error("Error removing bookmark:", deleteError)
        return { success: false, error: deleteError.message }
      }

      return { success: true, bookmarked: false }
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from("bookmarked_resources")
        .insert([{ user_id: user.id, resource_id: resourceId }])

      if (insertError) {
        console.error("Error adding bookmark:", insertError)
        return { success: false, error: insertError.message }
      }

      return { success: true, bookmarked: true }
    }
  } catch (error: any) {
    console.error("Error in toggleBookmarkResource:", error)
    return { success: false, error: error.message }
  }
}

// Weekly Goals with enhanced error handling
export async function getWeeklyGoal() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error("❌ No authenticated user for getting weekly goal")
      return { data: null, error: "Not authenticated" }
    }

    console.log("🔍 Getting weekly goal for user:", user.id)

    // Calculate start of current week (Sunday)
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0) // Set to start of day

    const weekStartStr = startOfWeek.toISOString().split("T")[0]
    console.log("📅 Looking for week start date:", weekStartStr)

    const { data, error } = await supabase
      .from("weekly_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("week_start", weekStartStr)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log("ℹ️ No weekly goal found for this week")
        return { data: null, error: null }
      }
      console.error("❌ Error getting weekly goal:", error)
      return { data: null, error: error.message }
    }

    console.log("✅ Weekly goal found:", data)
    return { data, error: null }
  } catch (error) {
    console.error("❌ Exception in getWeeklyGoal:", error)
    return { data: null, error: String(error) }
  }
}

export async function setWeeklyGoal(moodId: string, moodName: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error("❌ No authenticated user for weekly goal")
      return { success: false, error: "Not authenticated" }
    }

    console.log("🎯 Setting weekly goal for user:", user.id, "mood:", moodName)

    // Calculate start of current week (Sunday)
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0) // Set to start of day

    const weekStartStr = startOfWeek.toISOString().split("T")[0]
    console.log("📅 Week start date:", weekStartStr)

    // First, try to delete any existing weekly goal for this week
    const { error: deleteError } = await supabase
      .from("weekly_goals")
      .delete()
      .eq("user_id", user.id)
      .eq("week_start", weekStartStr)

    if (deleteError) {
      console.warn("⚠️ Could not delete existing weekly goal:", deleteError.message)
      // Continue anyway, the unique constraint will handle duplicates
    }

    // Create new weekly goal
    const goalData = {
      user_id: user.id,
      mood_id: moodId,
      mood_name: moodName,
      target_count: 3,
      week_start: weekStartStr,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("💾 Inserting weekly goal data:", goalData)

    const { data, error } = await supabase.from("weekly_goals").insert(goalData).select().single()

    if (error) {
      console.error("❌ Error setting weekly goal:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Weekly goal set successfully:", data)
    return { success: true, data, error: null }
  } catch (error) {
    console.error("❌ Exception in setWeeklyGoal:", error)
    return { success: false, error: String(error) }
  }
}

// Daily Challenges with enhanced logic
export async function getTodayChallenge() {
  try {
    const user = await getCurrentUser()
    if (!user) return { data: null, error: "Not authenticated" }

    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_date", today)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error getting today's challenge:", error)
      return { data: null, error: error.message }
    }

    return { data: error?.code === "PGRST116" ? null : data, error: null }
  } catch (error) {
    console.error("Error getting today's challenge:", error)
    return { data: null, error }
  }
}

export async function completeDailyChallenge() {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "Not authenticated" }

    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("daily_challenges")
      .upsert({
        user_id: user.id,
        challenge_date: today,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error completing daily challenge:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error completing daily challenge:", error)
    return { success: false, error }
  }
}

// Recent Mood Entries with better filtering
export async function getRecentMoodEntries(limit = 3) {
  try {
    const user = await getCurrentUser()
    if (!user) return { data: [], error: "Not authenticated" }

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error getting recent mood entries:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error getting recent mood entries:", error)
    return { data: [], error }
  }
}

// Enhanced Emotional Energy calculation
export async function getEmotionalEnergy() {
  try {
    const user = await getCurrentUser()
    if (!user) return { data: null, error: "Not authenticated" }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: moods, error } = await supabase
      .from("mood_entries")
      .select("emotion, created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())

    if (error || !moods || moods.length === 0) {
      return {
        data: {
          level: "Getting Started",
          percentage: 50,
          color: "bg-gray-300",
        },
        error,
      }
    }

    // Enhanced emotion categorization
    const positiveEmotions = ["Happy", "Excited", "Grateful", "Peaceful", "Confident", "Energetic"]
    const neutralEmotions = ["Calm", "Content", "Focused", "Curious"]
    const negativeEmotions = [
      "Sad",
      "Angry",
      "Anxious",
      "Frustrated",
      "Overwhelmed",
      "Tired",
      "Stressed",
      "Exhausted",
      "Confused",
    ]

    const positiveCount = moods.filter((m) => positiveEmotions.includes(m.emotion)).length
    const neutralCount = moods.filter((m) => neutralEmotions.includes(m.emotion)).length
    const negativeCount = moods.filter((m) => negativeEmotions.includes(m.emotion)).length
    const totalCount = moods.length

    // Weighted calculation: positive = +2, neutral = +1, negative = -1
    const weightedScore = positiveCount * 2 + neutralCount * 1 + negativeCount * -1
    const maxPossibleScore = totalCount * 2
    const minPossibleScore = totalCount * -1

    // Normalize to 0-100 scale
    const normalizedScore = ((weightedScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100
    const percentage = Math.max(0, Math.min(100, Math.round(normalizedScore)))

    let level, color
    if (percentage >= 75) {
      level = "Charged"
      color = "bg-green-400"
    } else if (percentage >= 60) {
      level = "Energized"
      color = "bg-lime-400"
    } else if (percentage >= 40) {
      level = "Mixed"
      color = "bg-yellow-400"
    } else if (percentage >= 25) {
      level = "Drained"
      color = "bg-orange-400"
    } else {
      level = "Burnout Risk"
      color = "bg-red-400"
    }

    return {
      data: { level, percentage, color },
      error: null,
    }
  } catch (error) {
    console.error("Error getting emotional energy:", error)
    return {
      data: {
        level: "Getting Started",
        percentage: 50,
        color: "bg-gray-300",
      },
      error,
    }
  }
}

// Helper functions
function getEmptyMoodStats(): MoodStats {
  const streakData = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    streakData.push({
      date: date.toISOString().split("T")[0],
      mood: "None",
      emoji: "⚪",
    })
  }

  return {
    totalEntries: 0,
    mostUsedMood: null,
    firstLogDate: null,
    streakData,
    moodDistribution: [],
  }
}

function getMoodColor(mood: string): string {
  const colorMap: Record<string, string> = {
    Happy: "#FFE5D9",
    Excited: "#FFD6E8",
    Grateful: "#E8F5E8",
    Peaceful: "#E0F2F1",
    Confident: "#FFF9C4",
    Energetic: "#FFE0B2",
    Calm: "#E3F2FD",
    Content: "#F3E5F5",
    Focused: "#E8EAF6",
    Curious: "#E0F7FA",
    Sad: "#D1C4E9",
    Angry: "#FFDDE1",
    Anxious: "#F3E5F5",
    Frustrated: "#FFCDD2",
    Overwhelmed: "#FFE0B2",
    Tired: "#F5F5F5",
    Stressed: "#FFCDD2",
    Exhausted: "#EFEBE9",
    Confused: "#F1F8E9",
  }
  return colorMap[mood] || "#F5F5F5"
}

export interface ExerciseUsage {
  id: string
  user_id: string
  exercise_type: string
  exercise_name: string | null
  duration_seconds: number | null
  completed: boolean
  created_at: string
  updated_at: string
}

// Enhanced exercise tracking functions
export async function logExerciseUsage(
  exerciseType: string,
  exerciseName?: string,
  durationSeconds?: number,
  completed = false,
): Promise<{ success: boolean; data?: ExerciseUsage; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data: exercise, error } = await supabase
      .from("exercise_usage")
      .insert([
        {
          user_id: user.id,
          exercise_type: exerciseType,
          exercise_name: exerciseName,
          duration_seconds: durationSeconds,
          completed,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error logging exercise usage:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: exercise }
  } catch (error: any) {
    console.error("Error in logExerciseUsage:", error)
    return { success: false, error: error.message }
  }
}

export async function getExerciseStats(): Promise<{
  totalSessions: number
  favoriteExercise: string | null
  totalMinutes: number
  completionRate: number
}> {
  try {
    const user = await getCurrentUser()
    if (!user) return { totalSessions: 0, favoriteExercise: null, totalMinutes: 0, completionRate: 0 }

    const { data: exercises, error } = await supabase.from("exercise_usage").select("*").eq("user_id", user.id)

    if (error || !exercises) {
      console.error("Error fetching exercise stats:", error)
      return { totalSessions: 0, favoriteExercise: null, totalMinutes: 0, completionRate: 0 }
    }

    const totalSessions = exercises.length
    const totalMinutes = Math.round(exercises.reduce((sum, ex) => sum + (ex.duration_seconds || 0), 0) / 60)
    const completedSessions = exercises.filter((ex) => ex.completed).length
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

    // Find most used exercise
    const exerciseCounts: Record<string, number> = {}
    exercises.forEach((ex) => {
      const key = ex.exercise_name || ex.exercise_type
      exerciseCounts[key] = (exerciseCounts[key] || 0) + 1
    })

    const favoriteExercise =
      Object.keys(exerciseCounts).length > 0
        ? Object.keys(exerciseCounts).reduce((a, b) => (exerciseCounts[a] > exerciseCounts[b] ? a : b))
        : null

    return { totalSessions, favoriteExercise, totalMinutes, completionRate }
  } catch (error) {
    console.error("Error in getExerciseStats:", error)
    return { totalSessions: 0, favoriteExercise: null, totalMinutes: 0, completionRate: 0 }
  }
}
