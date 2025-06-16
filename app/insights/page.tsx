"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, MessageCircle, BarChart3, Loader2, Sparkles, Target, Zap } from "lucide-react"
import { getMoodEntries, type MoodEntry } from "@/lib/supabase"

interface ProcessedMoodData {
  frequencyData: Array<{ mood: string; count: number; color: string; emoji: string }>
  trendData: Array<{ date: string; mood: number; emoji: string; moodName: string }>
  distributionData: Array<{ name: string; value: number; color: string; emoji: string }>
  topWords: string[]
  mostFrequent: { emoji: string; name: string; count: number } | null
  mostRecent: { emoji: string; name: string; timeAgo: string } | null
  longestStreak: { emoji: string; name: string; days: number } | null
}

const MOOD_COLORS: Record<string, string> = {
  // Strawberry - Pink/Red tones
  "Strawberry Bliss": "#FF69B4",

  // Sour Lemon - Yellow tones
  "Sour Lemon": "#FFD700",

  // Pineapple - Golden/Orange tones
  "Pineapple Punch": "#FF8C00",

  // Banana - Yellow tones
  "Slippery Banana": "#FFFF00",

  // Papaya - Orange/Coral tones
  "Spiky Papaya": "#FF6347",

  // Watermelon - Green/Pink tones
  "Watermelon Wave": "#00FF7F",

  // Blueberry - Blue tones
  "Blueberry Burnout": "#4169E1",

  // Grape - Purple tones
  "Grape Expectations": "#8A2BE2",

  // Peach - Peach/Orange tones
  "Peachy Keen": "#FFCBA4",

  // Mango - Orange/Yellow tones
  "Mango Mania": "#FFCC5C",

  // Apple - Green/Red tones
  "Apple Clarity": "#32CD32",

  // Cherry - Red tones
  "Cherry Charge": "#DC143C",

  // Guava - Pink/Red tones
  "Fiery Guava": "#FF1493",

  // Pear - Green/Yellow tones
  "Peer Pressure": "#9ACD32",

  // Musk (Cantaloupe) - Orange tones
  "Musk Melt": "#DDA0DD",

  // Kiwi - Green tones
  "Kiwi Comeback": "#ADFF2F",
}

const EMOTION_COLORS: Record<string, string> = {
  // Positive emotions - Warm colors
  Happy: "#FFD700", // Gold
  Joyful: "#FF69B4", // Hot Pink
  Excited: "#FF4500", // Orange Red
  Energetic: "#32CD32", // Lime Green
  Content: "#98FB98", // Pale Green
  Grateful: "#FFB6C1", // Light Pink
  Confident: "#00CED1", // Dark Turquoise
  Motivated: "#FF6347", // Tomato
  Hopeful: "#87CEEB", // Sky Blue
  Peaceful: "#90EE90", // Light Green
  Relaxed: "#DDA0DD", // Plum

  // Neutral emotions - Cool colors
  Calm: "#B0E0E6", // Powder Blue
  Focused: "#20B2AA", // Light Sea Green
  Determined: "#4682B4", // Steel Blue

  // Negative emotions - Darker/muted colors
  Sad: "#708090", // Slate Gray
  Angry: "#DC143C", // Crimson
  Frustrated: "#B22222", // Fire Brick
  Stressed: "#CD853F", // Peru
  Anxious: "#9370DB", // Medium Purple
  Worried: "#8B4513", // Saddle Brown
  Overwhelmed: "#2F4F4F", // Dark Slate Gray
  Exhausted: "#696969", // Dim Gray
  Tired: "#A0522D", // Sienna
  Lonely: "#778899", // Light Slate Gray
  Disappointed: "#BC8F8F", // Rosy Brown
  Confused: "#D2B48C", // Tan
  Melancholy: "#483D8B", // Dark Slate Blue
}

export default function InsightsPage() {
  const [timeFilter, setTimeFilter] = useState("7days")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [processedData, setProcessedData] = useState<ProcessedMoodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedChart, setExpandedChart] = useState<string | null>(null)
  const [selectedChartType, setSelectedChartType] = useState("frequency")

  useEffect(() => {
    loadInsightsData()
  }, [timeFilter, customDateRange])

  const filterMoodsByTimeRange = (moods: MoodEntry[], range: string): MoodEntry[] => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (range) {
      case "today":
        cutoffDate.setHours(0, 0, 0, 0)
        return moods.filter((mood) => {
          const moodDate = new Date(mood.created_at)
          const today = new Date()
          return (
            moodDate.getFullYear() === today.getFullYear() &&
            moodDate.getMonth() === today.getMonth() &&
            moodDate.getDate() === today.getDate()
          )
        })
      case "yesterday":
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        const endYesterday = new Date(yesterday)
        endYesterday.setHours(23, 59, 59, 999)
        return moods.filter((mood) => {
          const moodDate = new Date(mood.created_at)
          return (
            moodDate.getFullYear() === yesterday.getFullYear() &&
            moodDate.getMonth() === yesterday.getMonth() &&
            moodDate.getDate() === yesterday.getDate()
          )
        })
      case "7days":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "30days":
        cutoffDate.setDate(now.getDate() - 30)
        break
      case "90days":
        cutoffDate.setDate(now.getDate() - 90)
        break
      case "year":
        cutoffDate.setFullYear(now.getFullYear(), 0, 1)
        break
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          const startDate = new Date(customDateRange.start)
          const endDate = new Date(customDateRange.end)
          endDate.setHours(23, 59, 59, 999)
          return moods.filter((mood) => {
            const moodDate = new Date(mood.created_at)
            return moodDate >= startDate && moodDate <= endDate
          })
        }
        return moods
      case "all":
        return moods
      default:
        cutoffDate.setDate(now.getDate() - 7)
    }

    return moods.filter((mood) => new Date(mood.created_at) >= cutoffDate)
  }

  const processMoodData = (moods: MoodEntry[]): ProcessedMoodData => {
    if (!moods || moods.length === 0) {
      return {
        frequencyData: [],
        trendData: [],
        distributionData: [],
        topWords: [],
        mostFrequent: null,
        mostRecent: null,
        longestStreak: null,
      }
    }

    // Filter by time range
    const filteredMoods = filterMoodsByTimeRange(moods, timeFilter)

    // Calculate frequency data
    const moodCounts: Record<string, { count: number; emoji: string; emotion: string }> = {}
    filteredMoods.forEach((mood) => {
      const key = mood.mood_name
      if (!moodCounts[key]) {
        moodCounts[key] = { count: 0, emoji: mood.emoji, emotion: mood.emotion }
      }
      moodCounts[key].count++
    })

    const frequencyData = Object.entries(moodCounts)
      .map(([mood, data]) => ({
        mood: mood,
        count: data.count,
        color: MOOD_COLORS[mood] || EMOTION_COLORS[data.emotion] || "#FF6B9D",
        emoji: data.emoji,
      }))
      .sort((a, b) => b.count - a.count)

    // Calculate trend data (current week Sunday to Saturday)
    const trendData: Array<{ date: string; mood: number; emoji: string; moodName: string }> = []
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - currentDay) // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0)

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      const dayStr = date.toISOString().split("T")[0]
      const dayName = dayNames[i]

      const dayMoods = filteredMoods.filter((mood) => mood.created_at.split("T")[0] === dayStr)

      if (dayMoods.length > 0) {
        const latestMood = dayMoods[0] // Most recent mood of the day
        const moodLevel = getMoodLevel(latestMood.emotion)

        trendData.push({
          date: dayName,
          mood: moodLevel,
          emoji: latestMood.emoji,
          moodName: latestMood.mood_name,
        })
      } else {
        trendData.push({
          date: dayName,
          mood: 0,
          emoji: "⚪",
          moodName: "No entry",
        })
      }
    }

    // Calculate distribution data by emotion
    const emotionCounts: Record<string, { count: number; emoji: string }> = {}
    filteredMoods.forEach((mood) => {
      const emotion = mood.emotion
      if (!emotionCounts[emotion]) {
        emotionCounts[emotion] = { count: 0, emoji: mood.emoji }
      }
      emotionCounts[emotion].count++
    })

    const totalMoods = filteredMoods.length
    const distributionData = Object.entries(emotionCounts).map(([emotion, data]) => ({
      name: emotion,
      value: Math.round((data.count / totalMoods) * 100),
      color: EMOTION_COLORS[emotion] || "#FF6B9D",
      emoji: data.emoji,
    }))

    // Extract top words from notes
    const allNotes = filteredMoods
      .map((mood) => mood.note)
      .filter((note) => note && note.trim().length > 0)
      .join(" ")

    const topWords = extractTopWords(allNotes)

    // Calculate most frequent mood
    const mostFrequent =
      frequencyData.length > 0
        ? {
            emoji: frequencyData[0].emoji,
            name: frequencyData[0].mood.replace(/^.+ /, ""),
            count: frequencyData[0].count,
          }
        : null

    // Get most recent mood
    const mostRecent =
      filteredMoods.length > 0
        ? {
            emoji: filteredMoods[0].emoji,
            name: filteredMoods[0].mood_name,
            timeAgo: getTimeAgo(filteredMoods[0].created_at),
          }
        : null

    // Calculate longest streak (simplified - same mood consecutive days)
    const longestStreak = calculateLongestStreak(filteredMoods)

    return {
      frequencyData,
      trendData,
      distributionData,
      topWords,
      mostFrequent,
      mostRecent,
      longestStreak,
    }
  }

  const getMoodLevel = (emotion: string): number => {
    const positiveEmotions = [
      "Happy",
      "Joyful",
      "Excited",
      "Energetic",
      "Content",
      "Grateful",
      "Confident",
      "Motivated",
      "Hopeful",
      "Peaceful",
      "Relaxed",
    ]
    const negativeEmotions = [
      "Sad",
      "Angry",
      "Frustrated",
      "Stressed",
      "Anxious",
      "Worried",
      "Overwhelmed",
      "Exhausted",
      "Tired",
      "Lonely",
      "Disappointed",
      "Confused",
      "Melancholy",
    ]
    const neutralEmotions = ["Calm", "Focused", "Determined"]

    if (positiveEmotions.includes(emotion)) return 1
    if (negativeEmotions.includes(emotion)) return -1
    if (neutralEmotions.includes(emotion)) return 0
    return 0 // Default to neutral
  }

  const extractTopWords = (text: string): string[] => {
    if (!text) return []

    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "i",
      "me",
      "my",
      "myself",
      "we",
      "our",
      "ours",
      "ourselves",
      "you",
      "your",
      "yours",
      "is",
      "am",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "this",
      "that",
      "these",
      "those",
      "it",
      "its",
      "they",
      "them",
      "their",
      "theirs",
    ])

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word))

    const wordCounts: Record<string, number> = {}
    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })

    return Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  const getTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  const calculateLongestStreak = (moods: MoodEntry[]): { emoji: string; name: string; days: number } | null => {
    if (moods.length === 0) return null

    const filteredMoods = moods.filter((mood) => mood.mood_name !== "Sour Citrus")
    if (filteredMoods.length === 0) return null

    const sortedMoods = [...filteredMoods].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    let longestStreak = 1
    let currentStreak = 1
    let streakMood = sortedMoods[0]
    let longestStreakMood = sortedMoods[0]

    for (let i = 1; i < sortedMoods.length; i++) {
      const currentDate = new Date(sortedMoods[i].created_at).toDateString()
      const prevDate = new Date(sortedMoods[i - 1].created_at).toDateString()

      if (currentDate === prevDate && sortedMoods[i].mood_name === streakMood.mood_name) {
        continue
      }

      const dayDiff = (new Date(currentDate).getTime() - new Date(prevDate).getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1 && sortedMoods[i].mood_name === streakMood.mood_name) {
        currentStreak++
      } else {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
          longestStreakMood = streakMood
        }
        currentStreak = 1
        streakMood = sortedMoods[i]
      }
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak
      longestStreakMood = streakMood
    }

    return {
      emoji: longestStreakMood.emoji,
      name: longestStreakMood.mood_name,
      days: longestStreak,
    }
  }

  const loadInsightsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { success, data: moods, error: moodError } = await getMoodEntries()

      if (!success || !moods) {
        setError(moodError || "Failed to load mood data")
        return
      }

      const processed = processMoodData(moods)
      setProcessedData(processed)
    } catch (error) {
      console.error("Error loading insights:", error)
      setError("An error occurred while loading insights")
    } finally {
      setLoading(false)
    }
  }

  const openSlurpyChat = () => {
    window.location.href = "/slurpy-chat"
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-lg font-bold">Loading your fruity insights...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="container mx-auto px-4 py-6">
            <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-red-200 to-red-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🍎</div>
                <h3 className="text-xl font-black mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-700 mb-4">{error}</p>
                <Button
                  onClick={loadInsightsData}
                  className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-black text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  if (!processedData || processedData.frequencyData.length === 0) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="container mx-auto px-4 py-6">
            <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-yellow-200 to-yellow-300">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🍓</div>
                <h3 className="text-2xl font-black mb-2">No previous data found!</h3>
                <p className="text-gray-700 mb-4">
                  No mood entries exist for the selected time period. Your past data is safely stored and will appear
                  when you select the appropriate time range.
                </p>
                <Button
                  onClick={() => setTimeFilter("all")}
                  className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-black text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                >
                  View All Time Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
          <div className="container mx-auto px-4 py-6 space-y-8">
            {/* Header Section - Following Dashboard Layout */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 rounded-2xl border-[3px] border-black shadow-[8px_8px_0px_#000]" />
              <div className="relative bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] p-8 m-2">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-black">Mood Insights</h1>
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 font-bold">
                    {"Here's how your fruit-powered feelings have evolved"}
                  </p>

                  {/* Time Filter */}
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-48 border-[2px] border-black shadow-[4px_4px_0px_#000] bg-white font-bold hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-white">
                        <SelectItem value="today" className="font-bold">
                          Today
                        </SelectItem>
                        <SelectItem value="yesterday" className="font-bold">
                          Yesterday
                        </SelectItem>
                        <SelectItem value="7days" className="font-bold">
                          This Week
                        </SelectItem>
                        <SelectItem value="30days" className="font-bold">
                          This Month
                        </SelectItem>
                        <SelectItem value="90days" className="font-bold">
                          Last 3 Months
                        </SelectItem>
                        <SelectItem value="year" className="font-bold">
                          This Year
                        </SelectItem>
                        <SelectItem value="custom" className="font-bold">
                          Custom Range
                        </SelectItem>
                        <SelectItem value="all" className="font-bold">
                          All Time
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {timeFilter === "custom" && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                          className="border-[2px] border-black shadow-[2px_2px_0px_#000] rounded px-2 py-1 font-bold"
                        />
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                          className="border-[2px] border-black shadow-[2px_2px_0px_#000] rounded px-2 py-1 font-bold"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                      <SelectTrigger className="w-48 border-[2px] border-black shadow-[4px_4px_0px_#000] bg-white font-bold hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-white">
                        <SelectItem value="frequency" className="font-bold">
                          📊 Mood Frequency
                        </SelectItem>
                        <SelectItem value="distribution" className="font-bold">
                          🥧 Mood Distribution
                        </SelectItem>
                        <SelectItem value="trends" className="font-bold">
                          📈 Weekly Trends
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Most Frequent Mood */}
              <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-br from-pink-200 to-rose-300">
                <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                  <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Most Frequent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  {processedData.mostFrequent ? (
                    <>
                      <div className="flex justify-center mb-3">
                        <div className="bg-white p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                          {processedData.mostFrequent.emoji ? (
                            <img
                              src={processedData.mostFrequent.emoji || "/placeholder.svg"}
                              alt={processedData.mostFrequent.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <div className="text-4xl">🍓</div>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-lg text-black">{processedData.mostFrequent.name}</div>
                      <Badge className="bg-black text-white border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold mt-2">
                        {processedData.mostFrequent.count} time{processedData.mostFrequent.count !== 1 ? "s" : ""}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">🍓</div>
                      <div className="font-black text-lg">No data yet</div>
                      <div className="text-sm text-gray-600 font-medium">Start tracking moods</div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Most Recent Mood */}
              <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-br from-orange-200 to-amber-300">
                <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                  <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    Most Recent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  {processedData.mostRecent ? (
                    <>
                      <div className="flex justify-center mb-3">
                        <div className="bg-white p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                          {processedData.mostRecent.emoji ? (
                            <img
                              src={processedData.mostRecent.emoji || "/placeholder.svg"}
                              alt={processedData.mostRecent.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <div className="text-4xl">🫐</div>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-lg text-black">{processedData.mostRecent.name}</div>
                      <Badge className="bg-black text-white border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold mt-2">
                        {processedData.mostRecent.timeAgo}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">🫐</div>
                      <div className="font-black text-lg">No recent mood</div>
                      <div className="text-sm text-gray-600 font-medium">Add a mood entry</div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Longest Streak */}
              <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-br from-emerald-200 to-teal-300">
                <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                  <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    Longest Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  {processedData.longestStreak ? (
                    <>
                      <div className="flex justify-center mb-3">
                        <div className="bg-white p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                          {processedData.longestStreak.emoji ? (
                            <img
                              src={processedData.longestStreak.emoji || "/placeholder.svg"}
                              alt={processedData.longestStreak.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <div className="text-4xl">🍇</div>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-lg text-black">{processedData.longestStreak.name}</div>
                      <Badge className="bg-black text-white border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold mt-2">
                        {processedData.longestStreak.days} day{processedData.longestStreak.days !== 1 ? "s" : ""} in a
                        row
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">🍇</div>
                      <div className="font-black text-lg">No streak yet</div>
                      <div className="text-sm text-gray-600 font-medium">Keep tracking daily</div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-blue-200 to-indigo-300">
              <CardHeader className="border-b-[2px] border-black pb-3 relative bg-white">
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  {selectedChartType === "frequency" && "Mood Frequency"}
                  {selectedChartType === "distribution" && "Mood Distribution"}
                  {selectedChartType === "trends" && "Weekly Mood Trends (Sun - Sat)"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative overflow-hidden bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                {selectedChartType === "frequency" && processedData.frequencyData.length > 0 ? (
                  <>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Frequency",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className={`transition-all duration-300 ${
                        expandedChart === "frequency"
                          ? "h-[600px]"
                          : processedData.frequencyData.length > 5
                            ? "h-[400px]"
                            : "h-[350px]"
                      }`}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={processedData.frequencyData}
                          margin={{ left: 20, right: 20, top: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={1} />
                          <XAxis
                            dataKey="mood"
                            stroke="#000"
                            strokeWidth={2}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={10}
                            interval={0}
                          />
                          <YAxis stroke="#000" strokeWidth={2} domain={[0, "dataMax"]} allowDecimals={false} />
                          <ChartTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-3 border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg">
                                    <p className="font-bold">{label}</p>
                                    <p className="text-sm">Count: {data.count}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <img src={data.emoji || "/placeholder.svg"} alt={data.mood} className="w-4 h-4" />
                                      <span className="text-xs">Logged {data.count} times</span>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="count" fill="#FF6B9D" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    {processedData.frequencyData.length > 5 && expandedChart !== "frequency" && (
                      <div className="absolute bottom-6 left-6 right-6 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </>
                ) : selectedChartType === "frequency" ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-600 font-bold">No mood data to display</p>
                    </div>
                  </div>
                ) : null}

                {selectedChartType === "distribution" && processedData.distributionData.length > 0 ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full max-w-md">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Percentage",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-[250px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={processedData.distributionData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                              stroke="#000"
                              strokeWidth={2}
                            >
                              {processedData.distributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={2} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mx-auto">
                      {processedData.distributionData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white p-3 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000] min-h-[50px]"
                        >
                          <div
                            className="w-4 h-4 rounded-full border-[2px] border-black flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="flex-shrink-0">
                            {item.emoji ? (
                              <img
                                src={item.emoji || "/placeholder.svg"}
                                alt={item.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <div className="text-lg">🍎</div>
                            )}
                          </div>
                          <span className="font-bold text-sm flex-1 min-w-0">{item.name}</span>
                          <Badge className="bg-black text-white text-xs border-[1px] border-black shadow-[1px_1px_0px_#000] font-bold flex-shrink-0">
                            {item.value}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : selectedChartType === "distribution" ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍎</div>
                    <p className="text-lg font-bold text-gray-600">No fruit data to slice yet!</p>
                    <p className="text-sm text-gray-500">Start tracking your moods to see the juicy insights.</p>
                  </div>
                ) : null}

                {selectedChartType === "trends" && processedData.trendData.some((d) => d.mood > 0) ? (
                  <ChartContainer
                    config={{
                      mood: {
                        label: "Mood Level",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={processedData.trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={1} />
                        <XAxis dataKey="date" stroke="#000" strokeWidth={2} />
                        <YAxis
                          domain={[-1.5, 1.5]}
                          tickCount={4}
                          ticks={[-1, 0, 1]}
                          stroke="#000"
                          strokeWidth={2}
                          tickFormatter={(value) => {
                            if (value === 1) return "Positive (+1)"
                            if (value === 0) return "Neutral (0)"
                            if (value === -1) return "Negative (-1)"
                            return ""
                          }}
                        />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border-2 border-black shadow-[4px_4px_0px_#000] rounded-lg">
                                  <p className="font-bold">{label}</p>
                                  <p className="text-sm">{data.moodName}</p>
                                  <p className="text-xs">
                                    {data.mood === 1
                                      ? "Positive Mood"
                                      : data.mood === -1
                                        ? "Negative Mood"
                                        : "Neutral/No Entry"}
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#FF6B6B"
                          strokeWidth={4}
                          dot={{ fill: "#FF6B6B", strokeWidth: 3, r: 8, stroke: "#000" }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : selectedChartType === "trends" ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-600 font-bold">No trend data available</p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Encouragement Panel */}
            <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200">
              <CardContent className="p-8 text-center bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-orange-400 to-purple-400 p-4 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-black">{"Noticed some patterns? Let's talk about it! 🍊"}</h3>
                  <p className="text-gray-700 font-bold">
                    {"Slurpy is here to help you understand your mood patterns and find your fruity balance."}
                  </p>
                  <Button
                    onClick={openSlurpyChat}
                    className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-orange-400 to-purple-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold px-8 py-3 text-lg"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Talk to Slurpy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
