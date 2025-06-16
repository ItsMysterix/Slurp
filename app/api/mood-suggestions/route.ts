import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get user from session
    const cookieStore = cookies()
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({
        suggestion: "Welcome to Slurp! Start by logging your first mood to get personalized suggestions! 🍓",
      })
    }

    // Try to get recent mood entries
    let suggestion = ""
    try {
      const { data: moods, error } = await supabase
        .from("mood_entries")
        .select("mood_name, emotion, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) {
        console.error("Error fetching moods:", error)
        throw error
      }

      if (!moods || moods.length === 0) {
        suggestion = "Ready to start your mood journey? 🍓 Every great story begins with a single entry!"
      } else {
        const lastMood = moods[0]
        const daysSinceLastLog = Math.floor(
          (new Date().getTime() - new Date(lastMood.created_at).getTime()) / (1000 * 60 * 60 * 24),
        )

        if (daysSinceLastLog === 0) {
          suggestion = `Love seeing you check in today! Your ${lastMood.emotion.toLowerCase()} energy is noted 📝✨`
        } else if (daysSinceLastLog === 1) {
          suggestion = `Yesterday's ${lastMood.emotion.toLowerCase()} mood was captured! How are you feeling today? 🍊`
        } else if (daysSinceLastLog <= 7) {
          suggestion = `It's been ${daysSinceLastLog} days since your last check-in. Your mental health journey matters - let's log today's mood! 🌈`
        } else {
          suggestion =
            "Welcome back! 🌟 It's been a while - let's reconnect with your feelings and log today's mood! 🍹"
        }
      }
    } catch (dbError) {
      console.error("Database error in mood suggestions:", dbError)
      // Fallback to time-based suggestions
      const hour = new Date().getHours()
      if (hour < 12) {
        suggestion = "Good morning, sunshine! ☀️ How are you starting your day? Let's capture that morning energy! 🍊"
      } else if (hour < 17) {
        suggestion = "Afternoon check-in time! 🌤️ How's your day unfolding? Your feelings matter! 🍹"
      } else {
        suggestion = "Evening reflection time! 🌙 How did today treat you? Let's wrap up with some self-care! 🍇"
      }
    }

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error("Error in mood suggestions API:", error)
    return NextResponse.json({
      suggestion: "You're amazing just as you are! 🍓 Take a moment to check in with yourself today! ✨",
    })
  }
}
