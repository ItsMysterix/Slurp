// Simple Supabase client without complex imports
// This avoids the blob URL module errors

export interface User {
  id: string
  email: string
  name?: string
}

export interface Profile {
  id: string
  email: string
  name?: string
  username?: string
  avatar_url?: string
}

export interface Mood {
  id: string
  user_id: string
  mood_type: string
  fruit_label: string
  notes?: string
  timestamp: string
}

// Mock functions for now - replace with real Supabase later
export async function getCurrentUser(): Promise<User | null> {
  // Mock user for demo
  return {
    id: "demo-user-123",
    email: "demo@slurp.app",
    name: "Demo User",
  }
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.email.split("@")[0],
    avatar_url: null,
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
  // Mock sign in
  console.log("Mock sign in:", { email, password: "***" })

  return {
    user: {
      id: "demo-user-123",
      email: email,
      name: "Demo User",
    },
    error: null,
  }
}

export async function signUp(email: string, password: string): Promise<{ user: User | null; error: any }> {
  // Mock sign up
  console.log("Mock sign up:", { email, password: "***" })

  return {
    user: {
      id: "demo-user-123",
      email: email,
      name: "New User",
    },
    error: null,
  }
}

export async function signOut(): Promise<{ error: any }> {
  // Mock sign out
  console.log("Mock sign out")
  return { error: null }
}

export async function saveMood(moodData: {
  mood_type: string
  fruit_label: string
  notes?: string
}): Promise<Mood> {
  // Mock save mood
  const mood: Mood = {
    id: `mood-${Date.now()}`,
    user_id: "demo-user-123",
    mood_type: moodData.mood_type,
    fruit_label: moodData.fruit_label,
    notes: moodData.notes,
    timestamp: new Date().toISOString(),
  }

  console.log("Mock save mood:", mood)
  return mood
}

export async function getMoods(limit = 10): Promise<Mood[]> {
  // Mock get moods
  const mockMoods: Mood[] = [
    {
      id: "mood-1",
      user_id: "demo-user-123",
      mood_type: "Happy",
      fruit_label: "Sweetberry Bliss",
      notes: "Had a great day!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "mood-2",
      user_id: "demo-user-123",
      mood_type: "Calm",
      fruit_label: "Banana Balance",
      notes: "Feeling peaceful",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
  ]

  console.log("Mock get moods:", mockMoods)
  return mockMoods.slice(0, limit)
}
