"use client"

import { useState, useEffect } from "react"
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { getMoodEntries, addMoodEntry, deleteMoodEntry, type MoodEntry } from "@/lib/supabase"
import { fruityMoods } from "@/lib/mood-utils"
import { toast } from "sonner"
import { NeubrutalistCalendar } from "@/components/neubrutalist-calendar"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState("month")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDayMoods, setSelectedDayMoods] = useState<MoodEntry[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newMoodData, setNewMoodData] = useState({
    mood: "",
    note: "",
    selectedDate: new Date(),
  })

  // Fetch mood entries from Supabase
  useEffect(() => {
    loadMoodEntries()
  }, [])

  const loadMoodEntries = async () => {
    setLoading(true)
    try {
      const result = await getMoodEntries()
      if (result.success && result.data) {
        setMoodEntries(result.data)
      } else {
        console.error("Failed to load mood entries:", result.error)
        toast.error("Failed to load mood data")
      }
    } catch (error) {
      console.error("Error loading mood entries:", error)
      toast.error("Error loading mood data")
    } finally {
      setLoading(false)
    }
  }

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get days in current month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day names for header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day)

    // Get moods for the selected date
    const dayMoods = moodEntries.filter((entry) => isSameDay(new Date(entry.created_at), day))

    setSelectedDayMoods(dayMoods)
    setIsSheetOpen(true)
  }

  // Get mood for a specific day
  const getMoodForDay = (day: Date) => {
    return moodEntries.filter((entry) => isSameDay(new Date(entry.created_at), day))
  }

  // Get dominant mood color for a day
  const getDayColor = (day: Date) => {
    const dayMoods = getMoodForDay(day)
    if (dayMoods.length === 0) return "bg-white"

    // Use the most recent mood's color
    const recentMood = dayMoods[0]
    const moodConfig = fruityMoods.find((m) => m.emotion === recentMood.emotion)
    return moodConfig?.bgColor || "bg-gray-100"
  }

  // Calculate mood streak
  const calculateStreak = () => {
    if (moodEntries.length === 0) return { count: 0, mood: null }

    const today = new Date()
    let streakCount = 0
    let currentMood = null

    // Check consecutive days backwards from today
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)

      const dayMoods = moodEntries.filter((entry) => isSameDay(new Date(entry.created_at), checkDate))

      if (dayMoods.length === 0) break

      const dayMood = dayMoods[0].emotion
      if (currentMood === null) {
        currentMood = dayMood
        streakCount = 1
      } else if (dayMood === currentMood) {
        streakCount++
      } else {
        break
      }
    }

    return { count: streakCount, mood: currentMood }
  }

  // Handle adding new mood
  const handleAddMood = async () => {
    if (!newMoodData.mood) {
      toast.error("Please select a mood")
      return
    }

    const selectedMoodConfig = fruityMoods.find((m) => m.name === newMoodData.mood)
    if (!selectedMoodConfig) return

    try {
      const result = await addMoodEntry({
        mood_name: selectedMoodConfig.name,
        emoji: selectedMoodConfig.iconPath, // Store icon path
        emotion: selectedMoodConfig.emotion,
        note: newMoodData.note || null,
        bg_color: selectedMoodConfig.bgColor,
        location: null,
        is_private: false,
      })

      if (result.success) {
        toast.success("Mood logged successfully! 🍹")
        setIsAddModalOpen(false)
        setNewMoodData({ mood: "", note: "", selectedDate: new Date() })
        loadMoodEntries() // Refresh data
      } else {
        toast.error("Failed to save mood")
      }
    } catch (error) {
      console.error("Error adding mood:", error)
      toast.error("Error saving mood")
    }
  }

  // Handle deleting mood
  const handleDeleteMood = async (moodId: string) => {
    try {
      const result = await deleteMoodEntry(moodId)
      if (result.success) {
        toast.success("Mood deleted")
        loadMoodEntries() // Refresh data
        setSelectedDayMoods((prev) => prev.filter((m) => m.id !== moodId))
      } else {
        toast.error("Failed to delete mood")
      }
    } catch (error) {
      console.error("Error deleting mood:", error)
      toast.error("Error deleting mood")
    }
  }

  // Get mood icon for display
  const getMoodIcon = (entry: MoodEntry) => {
    const moodConfig = fruityMoods.find((m) => m.name === entry.mood_name)
    return moodConfig || fruityMoods[0] // Fallback to first mood
  }

  // Create an array of days including padding for the first week
  const firstDayOfMonth = monthStart.getDay() // 0 for Sunday, 1 for Monday, etc.
  const daysWithPadding = [...Array(firstDayOfMonth).fill(null), ...daysInMonth]

  const streak = calculateStreak()

  if (loading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-lg font-bold">Loading your fruity calendar... 🍓</p>
              </div>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-yellow-900 dark:via-pink-900 dark:to-purple-900 p-6">
          <NeubrutalistCalendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            moodEntries={moodEntries}
            selectedDayMoods={selectedDayMoods}
            setSelectedDayMoods={setSelectedDayMoods}
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            newMoodData={newMoodData}
            setNewMoodData={setNewMoodData}
            handleAddMood={handleAddMood}
            handleDeleteMood={handleDeleteMood}
            getMoodIcon={getMoodIcon}
            daysInMonth={daysInMonth}
            dayNames={dayNames}
            handleDayClick={handleDayClick}
            getMoodForDay={getMoodForDay}
            getDayColor={getDayColor}
            calculateStreak={calculateStreak}
            goToToday={goToToday}
            daysWithPadding={daysWithPadding}
            streak={streak}
          />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
