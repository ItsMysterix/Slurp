import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, getRecentMoodEntries, getMoodStats, getWeeklyGoal } from "@/lib/supabase"

// Enhanced Slurpy personality responses
const slurpyResponses = {
  greeting: [
    "Hey there, beautiful soul! 🍓 I'm Slurpy, your fruity mental health companion! How can I help you today?",
    "Welcome to our cozy corner! 🍊 I'm here to listen and support you. What's on your heart?",
    "Hi friend! 🍹 I'm Slurpy, and I'm so glad you're here. How are you feeling right now?",
  ],
  mood_support: {
    happy: [
      "I love seeing you shine! ✨ Your happiness is contagious! What's bringing you this joy?",
      "Your positive energy is beautiful! 🌟 How can we keep this good vibe flowing?",
      "This is wonderful! 🎉 Your happiness matters and I'm here celebrating with you!",
    ],
    sad: [
      "I see you, and your feelings are completely valid. 💙 It's okay to feel sad - you're not alone in this.",
      "Sending you gentle hugs. 🤗 Sadness is part of being human, and you're handling it with such courage.",
      "Your heart is tender right now, and that's okay. 💕 What do you need most in this moment?",
    ],
    anxious: [
      "I can feel your worry, and I want you to know it's going to be okay. 🌿 Let's breathe together.",
      "Anxiety can feel overwhelming, but you're stronger than you know. 💚 What usually helps you feel grounded?",
      "Your nervous system is trying to protect you. 🦋 Let's find some calm together. You're safe right now.",
    ],
    angry: [
      "Your anger is telling you something important. 🔥 It's okay to feel this way - let's explore it safely.",
      "I hear your frustration. 💪 Anger can be a powerful emotion when we understand what it's protecting.",
      "You have every right to feel angry. 🌋 Let's channel this energy in a way that serves you.",
    ],
    stressed: [
      "I can sense the pressure you're under. 🌊 Let's find some relief together. You don't have to carry this alone.",
      "Stress is your body's way of saying 'I need support.' 🍃 I'm here for you. What's feeling heaviest right now?",
      "You're juggling so much right now. 🤹‍♀️ Let's break things down into smaller, manageable pieces.",
    ],
  },
  encouragement: [
    "You're doing better than you think! 🌱 Every small step counts on this journey.",
    "I believe in your strength, even when you can't see it yourself. 💪✨",
    "Your mental health journey is unique and valid. 🦋 Be patient and kind with yourself.",
    "You showed up today, and that's already something to be proud of! 🌟",
    "Remember: progress isn't always linear, and that's perfectly okay. 🌈",
  ],
  coping_strategies: [
    "Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. 🌿",
    "Take 3 deep breaths with me: In for 4, hold for 4, out for 6. You've got this! 🌬️",
    "Sometimes a change of scenery helps - even just stepping outside for 2 minutes can shift your energy. 🌤️",
    "Write down 3 things you're grateful for right now, no matter how small. Gratitude is powerful medicine! 📝✨",
    "Put on your favorite song and let yourself feel whatever comes up. Music can be incredibly healing. 🎵",
  ],
  check_ins: [
    "How has your day been treating you? I'm here to listen. 🍊",
    "What's your energy level like right now? No judgment, just curiosity. ⚡",
    "Is there anything weighing on your heart that you'd like to share? 💕",
    "How are you taking care of yourself today? Self-care looks different for everyone. 🌸",
  ],
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
}

function detectMoodInMessage(message: string): string | null {
  const moodKeywords = {
    happy: ["happy", "joy", "excited", "great", "amazing", "wonderful", "fantastic", "good"],
    sad: ["sad", "down", "depressed", "blue", "upset", "hurt", "crying", "tears"],
    anxious: ["anxious", "worried", "nervous", "scared", "panic", "stress", "overwhelmed"],
    angry: ["angry", "mad", "furious", "frustrated", "annoyed", "irritated", "rage"],
    stressed: ["stressed", "pressure", "busy", "overwhelmed", "tired", "exhausted"],
  }

  const lowerMessage = message.toLowerCase()
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return mood
    }
  }
  return null
}

function generateContextualResponse(message: string, userContext: any): string {
  const lowerMessage = message.toLowerCase()

  // Greeting detection
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey") ||
    lowerMessage.match(/^(good\s+(morning|afternoon|evening))/)
  ) {
    return getRandomResponse(slurpyResponses.greeting)
  }

  // Mood detection and support
  const detectedMood = detectMoodInMessage(message)
  if (detectedMood && slurpyResponses.mood_support[detectedMood as keyof typeof slurpyResponses.mood_support]) {
    return getRandomResponse(slurpyResponses.mood_support[detectedMood as keyof typeof slurpyResponses.mood_support])
  }

  // Help/coping requests
  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("cope") ||
    lowerMessage.includes("what should i do") ||
    lowerMessage.includes("advice")
  ) {
    return getRandomResponse(slurpyResponses.coping_strategies)
  }

  // Check-in responses
  if (lowerMessage.includes("how are you") || lowerMessage.includes("what's up") || lowerMessage.includes("check in")) {
    return getRandomResponse(slurpyResponses.check_ins)
  }

  // Weekly goal context
  if (userContext.weeklyGoal) {
    if (lowerMessage.includes("goal") || lowerMessage.includes("week")) {
      return `I see you're working on your ${userContext.weeklyGoal.mood_name} goal this week! 🎯 How's that journey going for you? Remember, every small step counts! ✨`
    }
  }

  // Recent mood context
  if (userContext.recentMoods && userContext.recentMoods.length > 0) {
    const lastMood = userContext.recentMoods[0]
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastMood.created_at).getTime()) / (1000 * 60 * 60 * 24),
    )

    if (daysSince === 0) {
      return `I noticed you logged feeling ${lastMood.emotion.toLowerCase()} today. 🍊 How are you processing that emotion? I'm here to support you through it! 💕`
    }
  }

  // Default encouraging response
  return getRandomResponse(slurpyResponses.encouragement)
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const message = messages[messages.length - 1]?.content || ""
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Last message content is required and must be a string" }, { status: 400 })
    }

    // Get user context for personalized responses
    const user = await getCurrentUser()
    let userContext: any = {}

    if (user) {
      try {
        const [recentMoods, weeklyGoal, moodStats] = await Promise.all([
          getRecentMoodEntries(3),
          getWeeklyGoal(),
          getMoodStats(),
        ])

        userContext = {
          recentMoods: recentMoods.data,
          weeklyGoal: weeklyGoal.data,
          moodStats,
        }
      } catch (contextError) {
        console.error("Error loading user context:", contextError)
        // Continue without context
      }
    }

    // Generate contextual response
    const response = generateContextualResponse(message, userContext)

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        response:
          "I'm having a little technical hiccup right now, but I'm still here for you! 🍓 Sometimes the best support is just knowing someone cares - and I do! 💕",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
