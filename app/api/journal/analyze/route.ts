import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Constants for fallback values
const FALLBACK_ANALYSIS = {
  emotions: { reflective: 100 },
  energy_level: 50,
  insights:
    "Thank you for sharing your thoughts. Journaling is a powerful tool for self-reflection and emotional growth.",
}

// Helper function to extract and parse JSON from AI response
function parseAIResponse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch {
      const emotions = {}
      const energyMatch = text.match(/energy[_\s]*level[:\s]*(\d+)/i)
      const energy_level = energyMatch ? Number.parseInt(energyMatch[1]) : FALLBACK_ANALYSIS.energy_level

      let insights = FALLBACK_ANALYSIS.insights
      const insightPatterns = [/insights?[:\s]+"([^"]+)"/i, /insights?[:\s]+([^.]+\.)/i, /analysis[:\s]+([^.]+\.)/i]

      for (const pattern of insightPatterns) {
        const match = text.match(pattern)
        if (match) {
          insights = match[1].trim()
          break
        }
      }

      return { emotions, energy_level, insights }
    }
  }

  return FALLBACK_ANALYSIS
}

export async function POST(request: Request) {
  try {
    const { title, content, selected_fruits } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Create Supabase client with cookies for proper session handling
    const cookieStore = cookies()
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "Please log in to save journal entries",
        },
        { status: 401 },
      )
    }

    console.log("Using authenticated user:", user.id, user.email)

    // AI Analysis
    let analysis = FALLBACK_ANALYSIS

    if (process.env.OPENAI_API_KEY) {
      try {
        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: `Analyze this journal entry and respond with ONLY valid JSON:

{"emotions": {"emotion1": percentage, "emotion2": percentage}, "energy_level": number_0_to_100, "insights": "brief supportive message"}

Journal Entry:
Title: ${title || "Untitled"}
Content: ${content}
Selected Feelings: ${selected_fruits?.join(", ") || "None"}

Respond with ONLY the JSON object.`,
          maxTokens: 300,
          temperature: 0.1,
        })

        const parsed = parseAIResponse(text)
        analysis = {
          emotions:
            parsed.emotions && Object.keys(parsed.emotions).length > 0 ? parsed.emotions : FALLBACK_ANALYSIS.emotions,
          energy_level:
            typeof parsed.energy_level === "number" && parsed.energy_level >= 0 && parsed.energy_level <= 100
              ? parsed.energy_level
              : FALLBACK_ANALYSIS.energy_level,
          insights:
            parsed.insights && typeof parsed.insights === "string" && parsed.insights.trim()
              ? parsed.insights.trim()
              : FALLBACK_ANALYSIS.insights,
        }
      } catch (error) {
        console.error("AI analysis failed:", error)
      }
    }

    // Prepare entry data
    const entryData = {
      user_id: user.id,
      title: title || "Untitled Entry",
      content,
      selected_fruits: selected_fruits || [],
      analyzed_emotions: analysis.emotions,
      overall_energy_level: analysis.energy_level,
      ai_insights: analysis.insights,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save to database
    const { data: entry, error } = await supabase.from("journal_entries").insert(entryData).select().single()

    if (error) {
      console.error("Database save error:", error)
      return NextResponse.json(
        {
          error: "Failed to save journal entry",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      entry,
      analysis,
      message: "Journal entry saved successfully!",
    })
  } catch (error) {
    console.error("Journal analyze error:", error)
    return NextResponse.json(
      {
        error: "Failed to process journal entry",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
