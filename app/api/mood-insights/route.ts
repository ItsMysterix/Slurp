import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { moodSummary, totalMoods, dominantMood, period, disableMemory } = await request.json()

    const prompt = `
    You are a compassionate mood analysis expert. Analyze this mood data and provide helpful insights:
    
    Period: ${period}
    Total mood entries: ${totalMoods}
    Dominant mood: ${dominantMood}
    Mood breakdown: ${JSON.stringify(moodSummary)}
    
    ${disableMemory ? "Note: This analysis should be independent and not reference any previous data or conversations." : ""}
    
    Please provide:
    1. A brief analysis of the mood patterns
    2. Possible causes or triggers for the dominant mood
    3. 3-4 specific, actionable recommendations for improvement
    4. Encouragement and positive reinforcement
    
    Keep the tone warm, supportive, and professional. Limit response to 200-250 words.
    `

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 300,
    })

    return NextResponse.json({ insights: text })
  } catch (error) {
    console.error("Error generating mood insights:", error)

    // Fallback insights
    const fallbackInsights = `Based on your mood data, you've been actively tracking your emotional well-being, which is a positive step toward self-awareness. 

    Consider these recommendations:
    • Maintain a consistent sleep schedule to support emotional balance
    • Practice mindfulness or meditation for 5-10 minutes daily
    • Engage in physical activity that you enjoy
    • Connect with supportive friends or family members
    
    Remember, mood fluctuations are normal, and you're doing great by paying attention to your emotional health. Keep up the excellent work in tracking and understanding your feelings!`

    return NextResponse.json({ insights: fallbackInsights })
  }
}
