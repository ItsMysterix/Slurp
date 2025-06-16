"use server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

// Helper function to get server-side Supabase client
async function getSupabase() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Types
export interface MoodEntry {
  id?: string
  mood_name: string
  emoji: string
  emotion: string
  note?: string
  bg_color: string
  location?: string
  is_private?: boolean
  created_at?: string
}

// Create a new mood entry
export async function createMoodEntry(formData: MoodEntry) {
  try {
    const supabase = await getSupabase()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("You must be logged in to create a mood entry")
    }

    const { data, error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: user.id,
        mood_name: formData.mood_name,
        emoji: formData.emoji,
        emotion: formData.emotion,
        note: formData.note || null,
        bg_color: formData.bg_color,
        location: formData.location || null,
        is_private: formData.is_private || false,
      })
      .select()

    if (error) {
      throw error
    }

    revalidatePath("/slurp")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating mood entry:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Get all mood entries for the current user
export async function getMoodEntries() {
  try {
    const supabase = await getSupabase()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching mood entries:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Get a single mood entry by ID
export async function getMoodEntryById(id: string) {
  try {
    const supabase = await getSupabase()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data, error } = await supabase.from("mood_entries").select("*").eq("id", id).eq("user_id", user.id).single()

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching mood entry:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Update a mood entry
export async function updateMoodEntry(id: string, formData: Partial<MoodEntry>) {
  try {
    const supabase = await getSupabase()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("You must be logged in to update a mood entry")
    }

    const { data, error } = await supabase
      .from("mood_entries")
      .update({
        mood_name: formData.mood_name,
        emoji: formData.emoji,
        emotion: formData.emotion,
        note: formData.note,
        bg_color: formData.bg_color,
        location: formData.location,
        is_private: formData.is_private,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()

    if (error) {
      throw error
    }

    revalidatePath("/slurp")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating mood entry:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Delete a mood entry
export async function deleteMoodEntry(id: string) {
  try {
    const supabase = await getSupabase()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("You must be logged in to delete a mood entry")
    }

    const { error } = await supabase.from("mood_entries").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      throw error
    }

    revalidatePath("/slurp")
    return { success: true }
  } catch (error) {
    console.error("Error deleting mood entry:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Check authentication status and redirect if not authenticated
export async function checkAuth() {
  try {
    const supabase = await getSupabase()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    return { user: session.user }
  } catch (error) {
    console.error("Auth check error:", error)
    redirect("/login")
  }
}
