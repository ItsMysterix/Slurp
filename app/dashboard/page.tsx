"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TrendingUp, Clock, Battery, MessageCircle, Target, CheckCircle, Zap } from "lucide-react"
import {
  getUserProfile,
  getMoodStats,
  signOut,
  isAuthenticated,
  getWeeklyGoal,
  setWeeklyGoal,
  getTodayChallenge,
  completeDailyChallenge,
  getRecentMoodEntries,
  getEmotionalEnergy,
  type UserProfile,
  type MoodStats,
  type MoodEntry,
} from "@/lib/supabase"
import { fruityMoods, getFruityMoodById } from "@/lib/mood-utils"
import { useLanguage } from "@/lib/language-context"

const getDailyChallenge = (weeklyGoal: any, challengeCompleted: boolean) => {
  if (!weeklyGoal) {
    return dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]
  }

  const goalMood = getFruityMoodById(weeklyGoal.mood_id)
  const isNegativeMood = ["Sad", "Stressed", "Exhausted", "Angry", "Anxious", "Confused"].includes(
    goalMood?.emotion || "",
  )

  if (isNegativeMood) {
    const healingChallenges = [
      "Take 5 deep breaths and say 'I am enough' 🌸",
      "Write down one thing you're grateful for today 📝",
      "Listen to a song that makes you feel peaceful 🎵",
      "Step outside and feel the sun on your face ☀️",
      "Drink a warm cup of tea mindfully 🍵",
      "Text someone who makes you smile 💕",
      "Do gentle stretches for 3 minutes 🧘‍♀️",
      "Look in the mirror and give yourself a kind smile 😊",
      "Organize one small space to feel accomplished ✨",
      "Watch a funny video that makes you laugh 😄",
    ]
    return healingChallenges[Math.floor(Math.random() * healingChallenges.length)]
  } else {
    const positiveChallenges = [
      "Share your good vibes - compliment someone! 🌟",
      "Dance to your favorite song for 2 minutes 💃",
      "Take a photo of something beautiful you see 📸",
      "Call someone and tell them you appreciate them 📞",
      "Do 10 jumping jacks to boost your energy ⚡",
      "Write down 3 things that made you happy today 📝",
      "Smile at 3 strangers you pass by 😊",
      "Treat yourself to something small and special 🎁",
      "Share a positive post or message online 💫",
      "Plan something fun for this weekend 🎉",
    ]
    return positiveChallenges[Math.floor(Math.random() * positiveChallenges.length)]
  }
}

const dailyChallenges = [
  "Text a friend 🍓",
  "Drink a glass of water 🍋",
  "Go outside for 5 minutes 🍉",
  "Take 3 deep breaths 🍊",
  "Listen to your favorite song 🍇",
  "Write down one thing you're grateful for 🍑",
  "Stretch your arms and legs 🥝",
  "Smile at yourself in the mirror 🍍",
  "Organize one small space 🍌",
  "Call someone you care about 🫐",
]

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null)
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([])
  const [weeklyGoal, setWeeklyGoalState] = useState<any>(null)
  const [todayChallenge, setTodayChallenge] = useState<any>(null)
  const [emotionalEnergy, setEmotionalEnergy] = useState<any>(null)
  const [moodSuggestion, setMoodSuggestion] = useState<string>("")
  const [journalingPrompt, setJournalingPrompt] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [challengeCompleted, setChallengeCompleted] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }

        // Load all data in parallel
        const [userProfile, stats, recentMoodsResult, weeklyGoalResult, todayChallengeResult, emotionalEnergyResult] =
          await Promise.all([
            getUserProfile(),
            getMoodStats(),
            getRecentMoodEntries(3),
            getWeeklyGoal(),
            getTodayChallenge(),
            getEmotionalEnergy(),
          ])

        setProfile(userProfile)
        setMoodStats(stats)
        setRecentMoods(recentMoodsResult.data || [])
        setWeeklyGoalState(weeklyGoalResult.data)
        setTodayChallenge(todayChallengeResult.data)
        setEmotionalEnergy(emotionalEnergyResult.data)
        setChallengeCompleted(todayChallengeResult.data?.completed || false)

        // Load AI-powered features
        loadMoodSuggestion()
        loadJournalingPrompt()

        // Generate today's challenge if none exists
        if (!todayChallengeResult.data) {
          const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]
          setTodayChallenge({ challenge_text: randomChallenge, completed: false })
        }
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const loadMoodSuggestion = async () => {
    try {
      const response = await fetch("/api/mood-suggestions")

      if (!response.ok) {
        console.error(`Mood suggestions API error: ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Mood suggestions API returned non-JSON response")
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      setMoodSuggestion(data.suggestion || "Keep being awesome! 🍊")
    } catch (error) {
      console.error("Error loading mood suggestion:", error)
      // Set a time-based fallback suggestion
      const hour = new Date().getHours()
      let fallbackSuggestion = ""

      if (hour < 12) {
        fallbackSuggestion = "Good morning! ☀️ Ready to make today amazing? Start by logging your mood! 🍊"
      } else if (hour < 17) {
        fallbackSuggestion = "Afternoon energy check! 🌤️ How's your day treating you? 🍹"
      } else {
        fallbackSuggestion = "Evening wind-down time! 🌙 Reflect on your day with a mood log! 🍇"
      }

      setMoodSuggestion(fallbackSuggestion)
    }
  }

  const loadJournalingPrompt = async () => {
    try {
      const response = await fetch("/api/journaling-prompt")

      if (!response.ok) {
        console.error(`Journaling prompt API error: ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Journaling prompt API returned non-JSON response")
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      setJournalingPrompt(data.prompt || "What made you smile today? 🍊")
    } catch (error) {
      console.error("Error loading journaling prompt:", error)
      // Set a random fallback prompt
      const fallbackPrompts = [
        "What's one thing you're grateful for today? 🙏",
        "How are you feeling in this moment? 💭",
        "What made you smile recently? 😊",
        "What's something you're looking forward to? ✨",
        "How did you take care of yourself today? 🌸",
      ]
      const randomPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)]
      setJournalingPrompt(randomPrompt)
    }
  }

  const handleCompleteChallenge = async () => {
    try {
      const result = await completeDailyChallenge()
      if (result.success) {
        setChallengeCompleted(true)
      }
    } catch (error) {
      console.error("Error completing challenge:", error)
    }
  }

  const handleSetWeeklyGoal = async (moodId: string) => {
    try {
      const mood = getFruityMoodById(moodId)
      if (mood) {
        const result = await setWeeklyGoal(moodId, mood.name)
        if (result.success) {
          setWeeklyGoalState({ mood_id: moodId, mood_name: mood.name, target_count: 3 })
        }
      }
    } catch (error) {
      console.error("Error setting weekly goal:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100">
        <div className="text-center border-2 border-black bg-yellow-100 p-8 rounded-lg shadow-[6px_6px_0px_#000]">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto"></div>
          <p className="text-black font-bold text-lg">🍹 {t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100">
        <div className="text-center border-2 border-black bg-yellow-100 p-8 rounded-lg shadow-[6px_6px_0px_#000]">
          <p className="text-black font-bold text-lg mb-4">🔐 Please log in to continue</p>
          <Button onClick={() => router.push("/auth")} className="border-2 border-black bg-white">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const displayName = profile.username || profile.name || "Fruity Friend"
  const totalMoods = moodStats?.totalEntries || 0
  const weeklyMoods = moodStats?.streakData?.filter((day) => day.mood !== "None").length || 0

  // Calculate weekly goal progress
  const weeklyGoalProgress = weeklyGoal
    ? moodStats?.streakData?.filter((day) => {
        const goalMood = getFruityMoodById(weeklyGoal.mood_id)
        return goalMood && day.mood === goalMood.emotion
      }).length || 0
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 font-sans">
      {/* Navigation */}
      <nav className="border-b-4 border-black bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 p-4 shadow-[0_4px_0px_#000]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">{t("nav.dashboard")}</h1>
          <div className="flex gap-4 items-center">
            <Button
              asChild
              className="border-2 border-black bg-blue-100 px-4 py-2 font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-blue-200 flex items-center gap-2"
            >
              <Link href="/chat">
                <img src="/slurpy-chatbot.ico" alt="Slurpy" width={20} height={20} className="rounded-full" />
                Chat with Slurpy
              </Link>
            </Button>
            <Button
              onClick={handleSignOut}
              className="border-2 border-black bg-red-100 px-4 py-2 font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-red-200"
            >
              {t("nav.signOut")}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Header with Emotional Energy Meter */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between gap-6 bg-white border-2 border-black rounded-xl p-6 shadow-[6px_6px_0px_#000]">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-black mb-2">
              {t("dashboard.welcome")}, {displayName}! 🍹
            </h1>
            <p className="text-lg text-gray-600">{t("dashboard.howFeeling")}</p>
            <Button
              asChild
              className="mt-4 rounded-lg border-3 border-black bg-gradient-to-r from-red-400 to-pink-500 px-6 py-3 text-lg font-bold text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 transition-all"
            >
              <Link href="/add">
                <Plus className="mr-2 h-5 w-5" />
                {t("dashboard.addMood")}
              </Link>
            </Button>
          </div>

          {/* Emotional Energy Meter */}
          {emotionalEnergy && (
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-black mb-2">⚡ {t("dashboard.energyLevel")}</h3>
              <div className="relative w-16 h-32 border-3 border-black rounded-lg bg-white shadow-[4px_4px_0px_#000]">
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-b-md transition-all duration-500 ${emotionalEnergy.color}`}
                  style={{ height: `${emotionalEnergy.percentage}%` }}
                ></div>
                <Battery className="absolute top-1 left-1/2 transform -translate-x-1/2 h-4 w-4 text-black" />
              </div>
              <p className="text-sm font-bold text-black mt-2">{emotionalEnergy.level}</p>
              <p className="text-xs text-gray-600">{emotionalEnergy.percentage}%</p>
            </div>
          )}
        </div>

        {/* Improved Grid Layout for Better Organization */}
        <div className="grid gap-6">
          {/* Top Row - Main Features */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Smart Mood Suggestion */}
            <Card className="border-[2px] border-black bg-green-100 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all">
              <CardHeader className="border-b-2 border-black bg-green-200 pb-3">
                <CardTitle className="flex items-center text-black">
                  <Zap className="mr-2 h-5 w-5" />
                  {t("dashboard.weeklyGoal")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {weeklyGoal ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-10 w-10 rounded-full bg-white border-2 border-black p-1 flex items-center justify-center">
                        {(() => {
                          const mood = getFruityMoodById(weeklyGoal.mood_id)
                          return mood ? (
                            <>
                              <img
                                src={mood.iconPath || "/mood-icons/strawberry-bliss.ico"}
                                alt={mood.name}
                                className="h-6 w-6"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                  e.currentTarget.nextElementSibling.style.display = "block"
                                }}
                              />
                              <span className="text-lg hidden" style={{ display: mood.iconPath ? "none" : "block" }}>
                                🍓
                              </span>
                            </>
                          ) : (
                            <span className="text-lg">🍎</span>
                          )
                        })()}
                      </div>
                      <div>
                        <p className="font-bold text-black">{weeklyGoal.mood_name}</p>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-full bg-white rounded-full border border-black overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${Math.min((weeklyGoalProgress / 3) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-black">{weeklyGoalProgress}/3</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-black">
                      {weeklyGoalProgress >= 3
                        ? "🎉 Goal achieved! You're amazing!"
                        : moodSuggestion || "Keep working toward your goal!"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-black mb-3">Choose a mood to focus on this week:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {fruityMoods.slice(0, 6).map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() => handleSetWeeklyGoal(mood.id)}
                          className="flex flex-col items-center justify-center p-2 rounded-lg border-2 border-black bg-white hover:bg-gray-100"
                        >
                          <img
                            src={mood.iconPath || "/mood-icons/strawberry-bliss.ico"}
                            alt={mood.name}
                            className="h-6 w-6 mb-1"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                              e.currentTarget.nextElementSibling.style.display = "block"
                            }}
                          />
                          <span className="text-lg hidden" style={{ display: mood.iconPath ? "none" : "block" }}>
                            🍓
                          </span>
                          <span className="text-xs font-bold text-black truncate">{mood.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Mission */}
            <Card className="border-[2px] border-black bg-blue-100 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all">
              <CardHeader className="border-b-2 border-black bg-blue-200 pb-3">
                <CardTitle className="flex items-center text-black">
                  <Target className="mr-2 h-5 w-5" />
                  {t("dashboard.todaysMission")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {todayChallenge ? (
                  <div>
                    <p className="text-lg font-bold text-black mb-3">{todayChallenge.challenge_text}</p>
                    {challengeCompleted ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-bold">{t("dashboard.completed")}</span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleCompleteChallenge}
                        className="w-full border-2 border-black bg-yellow-300 font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-yellow-400"
                      >
                        {t("dashboard.markAsDone")}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-black">Loading today's mission...</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Logs */}
            <Card className="border-[2px] border-black bg-purple-100 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all">
              <CardHeader className="border-b-2 border-black bg-purple-200 pb-3">
                <CardTitle className="flex items-center text-black">
                  <Clock className="mr-2 h-5 w-5" />
                  {t("dashboard.recentLogs")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {recentMoods && recentMoods.length > 0 ? (
                  <div className="space-y-3">
                    {recentMoods.map((entry) => {
                      const mood = getFruityMoodById(entry.mood_id)
                      return (
                        <div key={entry.id} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white border-2 border-black p-1 flex items-center justify-center">
                            {mood?.iconPath ? (
                              <img
                                src={mood.iconPath || "/placeholder.svg"}
                                alt={mood.name}
                                className="h-5 w-5"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                  e.currentTarget.nextElementSibling.style.display = "block"
                                }}
                              />
                            ) : null}
                            <span className="text-sm" style={{ display: mood?.iconPath ? "none" : "block" }}>
                              {mood?.emoji || "🍓"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-black">{entry.mood_name}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(entry.created_at).toLocaleString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-black">No recent mood logs. Add your first mood!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Additional Features */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mood Insights */}
            <Card className="border-[2px] border-black bg-orange-100 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all">
              <CardHeader className="border-b-2 border-black bg-orange-200 pb-3">
                <CardTitle className="flex items-center text-black">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  {t("dashboard.moodInsights")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg border-2 border-black bg-white p-3 text-center">
                    <p className="text-xs text-gray-600">{t("dashboard.totalEntries")}</p>
                    <p className="text-xl font-bold text-black">{totalMoods}</p>
                  </div>
                  <div className="rounded-lg border-2 border-black bg-white p-3 text-center">
                    <p className="text-xs text-gray-600">{t("dashboard.thisWeek")}</p>
                    <p className="text-xl font-bold text-black">{weeklyMoods}</p>
                  </div>
                  <div className="rounded-lg border-2 border-black bg-white p-3 text-center">
                    <p className="text-xs text-gray-600">{t("dashboard.mostUsed")}</p>
                    <p className="text-xl font-bold text-black">{moodStats?.mostFrequentMood?.emoji || "🍎"}</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full border-2 border-black bg-orange-300 font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-orange-400"
                >
                  <Link href="/insights">{t("dashboard.viewDetails")}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Write with Slurpy */}
            <Card className="border-[2px] border-black bg-pink-100 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all">
              <CardHeader className="border-b-2 border-black bg-pink-200 pb-3">
                <CardTitle className="flex items-center text-black">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t("dashboard.writeWithSlurpy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4 rounded-lg border-2 border-black bg-white p-4">
                  <p className="text-lg font-bold text-black mb-2">Today's Prompt:</p>
                  <p className="text-black">{journalingPrompt}</p>
                </div>
                <Button
                  asChild
                  className="w-full border-2 border-black bg-pink-300 font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-pink-400"
                >
                  <Link href="/journal">{t("dashboard.openJournal")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 7-Day Streak */}
          <Card className="border-[2px] border-black bg-yellow-100 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all">
            <CardHeader className="border-b-2 border-black bg-yellow-200 pb-3">
              <CardTitle className="flex items-center text-black">
                <Zap className="mr-2 h-5 w-5" />
                {t("dashboard.7dayStreak")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-7 gap-2">
                {moodStats?.streakData?.map((day, index) => {
                  const mood = day.mood !== "None" ? fruityMoods.find((m) => m.emotion === day.mood) : null
                  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  const dayIndex = new Date(day.date).getDay()
                  const dayName = dayNames[dayIndex]

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center rounded-lg border-2 border-black p-2 ${
                        mood ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      <p className="text-xs font-bold text-black">{dayName}</p>
                      {mood ? (
                        <div className="my-1">
                          <img
                            src={mood.iconPath || "/mood-icons/strawberry-bliss.ico"}
                            alt={mood.name}
                            className="h-8 w-8"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                              e.currentTarget.nextElementSibling.style.display = "block"
                            }}
                          />
                          <span className="text-2xl hidden" style={{ display: mood.iconPath ? "none" : "block" }}>
                            {day.emoji}
                          </span>
                        </div>
                      ) : (
                        <div className="my-1 h-8 w-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-gray-300">⚪</span>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-600 truncate max-w-full">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {t("dashboard.mostRecentLog")}
                  {moodStats?.lastEntryDate ? (
                    <span className="font-bold">
                      {" "}
                      {new Date(moodStats.lastEntryDate).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span className="font-bold"> {t("dashboard.never")}</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
