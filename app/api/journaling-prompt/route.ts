import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const journalingPrompts = [
  "What made you smile today? 😊",
  "What's one thing you're grateful for right now? 🙏",
  "How did you show kindness to yourself today? 💕",
  "What's something you're looking forward to? ✨",
  "Describe a moment that brought you peace today 🌸",
  "What's one thing you learned about yourself recently? 🌱",
  "How are you feeling in this very moment? 🍃",
  "What would you tell your past self from a week ago? 💌",
  "What's one small victory you had today? 🎉",
  "How did you take care of your mental health today? 🧘‍♀️",
  "What's something beautiful you noticed today? 🌺",
  "How did you connect with others today? 🤝",
  "What's one thing you're proud of yourself for? 🌟",
  "How did you handle a challenge today? 💪",
  "What brings you comfort when you need it most? 🫂",
]

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
      // Return a welcoming prompt for non-authenticated users
      return NextResponse.json({
        prompt: "Welcome to journaling! What's on your mind today? 🍓",
      })
    }

    // Try to get personalized prompt based on recent activity
    let prompt = ""
    try {
      const { data: recentEntries, error } = await supabase
        .from("journal_entries")
        .select("title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error fetching journal entries:", error)
        throw error
      }

      if (!recentEntries || recentEntries.length === 0) {
        prompt = "Welcome to your journaling journey! What's on your heart today? 🌟"
      } else {
        const daysSinceLastEntry = Math.floor(
          (new Date().getTime() - new Date(recentEntries[0].created_at).getTime()) / (1000 * 60 * 60 * 24),
        )

        if (daysSinceLastEntry === 0) {
          prompt = "You're on a roll with journaling today! What else would you like to explore? ✨"
        } else if (daysSinceLastEntry === 1) {
          prompt = "Welcome back! How has your day been different from yesterday? 🌅"
        } else {
          prompt = `It's been ${daysSinceLastEntry} days since your last entry. What's been happening in your world? 🌍`
        }
      }
    } catch (dbError) {
      console.error("Database error in journaling prompts:", dbError)
      // Fallback to random prompt
      prompt = journalingPrompts[Math.floor(Math.random() * journalingPrompts.length)]
    }

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error("Error in journaling prompt API:", error)
    // Always return a fallback prompt
    const fallbackPrompt = journalingPrompts[Math.floor(Math.random() * journalingPrompts.length)]
    return NextResponse.json({ prompt: fallbackPrompt })
  }
}
