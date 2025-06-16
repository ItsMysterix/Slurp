"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Plus, Clock, Edit, Trash2 } from "lucide-react"
import { getMoodEntries, addMoodEntry, deleteMoodEntry, updateMoodEntry, type MoodEntry } from "@/lib/supabase"
import { fruityMoods } from "@/lib/mood-utils"
import { MoodIcon } from "@/components/mood-icon"
import { toast } from "sonner"

interface CalendarProps {
  className?: string
}

export function NeubrutalistCalendar({ className = "" }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [filteredMoods, setFilteredMoods] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedDayMoods, setSelectedDayMoods] = useState<MoodEntry[]>([])
  const [newMoodData, setNewMoodData] = useState({
    mood: "",
    note: "",
  })

  const [editingMood, setEditingMood] = useState<MoodEntry | null>(null)
  const [editMoodData, setEditMoodData] = useState({
    mood: "",
    note: "",
  })

  // Fruit filter options - use actual fruity moods
  const fruitFilters = [
    { id: "all", emoji: "🍹", name: "All", color: "bg-gradient-to-r from-pink-200 to-purple-200" },
    ...fruityMoods.map((mood) => ({
      id: mood.id,
      emoji: mood.iconPath,
      name: mood.name.split(" ")[0], // Use just the first word for space efficiency
      color: mood.bgColor.replace("bg-", "bg-gradient-to-r from-").replace("-100", "-200 to-purple-200"),
    })),
  ]

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
        toast.error("Failed to load mood data")
      }
    } catch (error) {
      console.error("Error loading mood entries:", error)
      toast.error("Error loading mood data")
    } finally {
      setLoading(false)
    }
  }

  // Get days in current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Create calendar grid with padding
  const firstDayOfMonth = monthStart.getDay()
  const daysWithPadding = [...Array(firstDayOfMonth).fill(null), ...daysInMonth]

  // Filter moods based on selected filters
  const getFilteredMoodsForDay = (day: Date) => {
    const dayMoods = moodEntries.filter((entry) => isSameDay(new Date(entry.created_at), day))

    if (filteredMoods.length === 0 || filteredMoods.includes("all")) {
      return dayMoods
    }

    return dayMoods.filter((mood) => {
      const moodConfig = fruityMoods.find((m) => m.name === mood.mood_name)
      return moodConfig && filteredMoods.includes(moodConfig.id)
    })
  }

  // Get background intensity for a day
  const getDayIntensity = (day: Date) => {
    const dayMoods = getFilteredMoodsForDay(day)
    const count = dayMoods.length

    if (count === 0) return "bg-white dark:bg-gray-900"
    if (count === 1) return "bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950"
    if (count === 2) return "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900"
    return "bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800"
  }

  // Handle date click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    const dayMoods = getFilteredMoodsForDay(day)
    setSelectedDayMoods(dayMoods)
    setIsSheetOpen(true)
  }

  // Handle filter toggle
  const toggleFilter = (filterId: string) => {
    if (filterId === "all") {
      setFilteredMoods([])
      return
    }

    setFilteredMoods((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev.filter((id) => id !== "all"), filterId],
    )
  }

  // Handle adding new mood
  const handleAddMood = async () => {
    if (!newMoodData.mood || !selectedDate) {
      toast.error("Please select a mood")
      return
    }

    const selectedMoodConfig = fruityMoods.find((m) => m.name === newMoodData.mood)
    if (!selectedMoodConfig) return

    try {
      const result = await addMoodEntry({
        mood_name: selectedMoodConfig.name,
        emoji: selectedMoodConfig.iconPath,
        emotion: selectedMoodConfig.emotion,
        note: newMoodData.note || null,
        bg_color: selectedMoodConfig.bgColor,
        location: null,
        is_private: false,
      })

      if (result.success) {
        toast.success("Mood logged successfully! 🍹")
        setIsAddModalOpen(false)
        setNewMoodData({ mood: "", note: "" })
        loadMoodEntries()
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
        loadMoodEntries()
        setSelectedDayMoods((prev) => prev.filter((m) => m.id !== moodId))
      } else {
        toast.error("Failed to delete mood")
      }
    } catch (error) {
      console.error("Error deleting mood:", error)
      toast.error("Error deleting mood")
    }
  }

  const handleEditMood = (mood: MoodEntry) => {
    setEditingMood(mood)
    setEditMoodData({
      mood: mood.mood_name,
      note: mood.note || "",
    })
  }

  const handleSaveEdit = async () => {
    if (!editingMood || !editMoodData.mood) {
      toast.error("Please select a mood")
      return
    }

    const selectedMoodConfig = fruityMoods.find((m) => m.name === editMoodData.mood)
    if (!selectedMoodConfig) return

    try {
      const result = await updateMoodEntry(editingMood.id, {
        mood_name: selectedMoodConfig.name,
        emoji: selectedMoodConfig.iconPath,
        emotion: selectedMoodConfig.emotion,
        note: editMoodData.note || null,
        bg_color: selectedMoodConfig.bgColor,
        updated_at: new Date().toISOString(), // Log the time and date
      })

      if (result.success) {
        toast.success(`Mood updated at ${new Date().toLocaleString()}! 🍹`)
        setEditingMood(null)
        setEditMoodData({ mood: "", note: "" })
        loadMoodEntries()
        // Update the selected day moods
        setSelectedDayMoods((prev) => prev.map((m) => (m.id === editingMood.id ? { ...m, ...result.data } : m)))
      } else {
        toast.error("Failed to update mood")
      }
    } catch (error) {
      console.error("Error updating mood:", error)
      toast.error("Error updating mood")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-[4px] border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-black">Loading your fruity calendar... 🍓</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <Card className="border-[4px] border-black shadow-[8px_8px_0px_#000] bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 dark:from-yellow-800 dark:via-pink-800 dark:to-purple-800">
          <CardHeader className="border-b-[4px] border-black pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-black tracking-tight text-black dark:text-white">
                🗓️ Fruity Calendar
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="h-10 w-10 border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-white dark:bg-gray-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="px-4 py-2 bg-white dark:bg-gray-800 border-[3px] border-black shadow-[4px_4px_0px_#000] font-black text-lg min-w-[200px] text-center">
                  {format(currentDate, "MMMM yyyy")}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="h-10 w-10 border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-white dark:bg-gray-800"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Mood Filter Bar */}
        <Card className="border-[4px] border-black shadow-[6px_6px_0px_#000] bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="text-lg font-black text-black">🍹 Filter by Mood:</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {fruitFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    size="sm"
                    className={`
                      border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] 
                      hover:translate-x-[-1px] hover:translate-y-[-1px] font-black text-xs px-2 py-1 h-8
                      ${
                        (filteredMoods.length === 0 && filter.id === "all") || filteredMoods.includes(filter.id)
                          ? `${filter.color} ring-[2px] ring-black ring-offset-1`
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {filter.id === "all" ? (
                      <span className="text-sm mr-1">🍹</span>
                    ) : (
                      <div className="w-4 h-4 mr-1 border-[1px] border-black shadow-[1px_1px_0px_#000] bg-white dark:bg-gray-800 rounded-sm flex items-center justify-center">
                        <MoodIcon mood={fruityMoods.find((m) => m.id === filter.id)!} size={12} />
                      </div>
                    )}
                    <span className="truncate max-w-[60px]">{filter.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="border-[4px] border-black shadow-[8px_8px_0px_#000] bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-black text-lg bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 border-[2px] border-black shadow-[2px_2px_0px_#000]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {daysWithPadding.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dayMoods = getFilteredMoodsForDay(day)
                const isCurrentDay = isToday(day)
                const dayIntensity = getDayIntensity(day)

                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => handleDayClick(day)}
                        className={`
                          aspect-square cursor-pointer border-[3px] border-black shadow-[3px_3px_0px_#000] 
                          hover:shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] 
                          transition-all p-2 flex flex-col justify-between
                          ${dayIntensity}
                          ${isCurrentDay ? "ring-[4px] ring-yellow-400 ring-offset-2" : ""}
                        `}
                      >
                        {/* Date Number */}
                        <div
                          className={`text-sm font-black ${isCurrentDay ? "text-yellow-600 dark:text-yellow-400" : "text-black dark:text-white"}`}
                        >
                          {format(day, "d")}
                        </div>

                        {/* Mood Icons */}
                        <div className="flex flex-wrap gap-1 justify-center items-end flex-1">
                          {dayMoods.slice(0, 3).map((mood, idx) => {
                            const moodConfig = fruityMoods.find((m) => m.name === mood.mood_name)
                            return moodConfig ? (
                              <div
                                key={idx}
                                className="w-6 h-6 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-white dark:bg-gray-800 rounded-sm flex items-center justify-center"
                              >
                                <MoodIcon mood={moodConfig} size={16} />
                              </div>
                            ) : (
                              <span key={idx} className="text-xs">
                                🍹
                              </span>
                            )
                          })}
                          {dayMoods.length > 3 && (
                            <div className="w-6 h-6 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-yellow-200 dark:bg-yellow-800 rounded-sm flex items-center justify-center">
                              <span className="text-xs font-black">+{dayMoods.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="border-[3px] border-black shadow-[4px_4px_0px_#000] bg-white dark:bg-gray-800 p-3 max-w-xs">
                      <div className="space-y-2">
                        <p className="font-black text-black dark:text-white">{format(day, "EEEE, MMMM d")}</p>
                        {dayMoods.length === 0 ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400">No moods logged</p>
                        ) : (
                          dayMoods.map((mood, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">{format(new Date(mood.created_at), "h:mm a")}</span>
                              <span className="font-black">{mood.mood_name}</span>
                              {mood.note && (
                                <span className="text-gray-600 dark:text-gray-400 truncate">- {mood.note}</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="border-l-[4px] border-black shadow-[-8px_0px_0px_#000] bg-gradient-to-b from-cream to-pink-50 dark:from-gray-900 dark:to-gray-800 w-full sm:max-w-md">
            <SheetHeader className="border-b-[3px] border-black pb-4 mb-6">
              <SheetTitle className="text-2xl font-black text-black dark:text-white">
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4">
              {/* Add Mood Button */}
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800 text-black dark:text-white font-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Mood
              </Button>

              {/* Existing Moods */}
              {selectedDayMoods.length === 0 ? (
                <Card className="border-[3px] border-black shadow-[4px_4px_0px_#000] bg-yellow-100 dark:bg-yellow-900">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">🍋</div>
                    <p className="text-lg font-black text-black dark:text-white">No fruity moods today</p>
                    <p className="text-gray-600 dark:text-gray-400">Add your first mood for this day!</p>
                  </CardContent>
                </Card>
              ) : (
                selectedDayMoods.map((mood) => {
                  const moodConfig = fruityMoods.find((m) => m.name === mood.mood_name)
                  return (
                    <Card
                      key={mood.id}
                      className={`border-[3px] border-black shadow-[4px_4px_0px_#000] ${moodConfig?.bgColor || "bg-gray-100"} dark:bg-gray-800`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {moodConfig && (
                                <div className="w-10 h-10 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-white dark:bg-gray-700 rounded-sm flex items-center justify-center">
                                  <MoodIcon mood={moodConfig} size={24} />
                                </div>
                              )}
                              <div>
                                <h4 className="font-black text-black dark:text-white">{mood.mood_name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{mood.emotion}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">{format(new Date(mood.created_at), "h:mm a")}</span>
                            </div>

                            {mood.note && (
                              <p className="text-sm bg-white/70 dark:bg-gray-700/70 rounded p-2 border-[2px] border-black shadow-[2px_2px_0px_#000]">
                                {mood.note}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditMood(mood)}
                              className="border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] bg-white dark:bg-gray-700"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteMood(mood.id)}
                              className="border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:bg-red-100 dark:hover:bg-red-900 bg-white dark:bg-gray-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Add Mood Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="border-[4px] border-black shadow-[8px_8px_0px_#000] bg-white dark:bg-gray-900 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b-[3px] border-black pb-4">
              <DialogTitle className="text-2xl font-black text-black dark:text-white">
                🍹 Log Your Fruity Mood
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-black mb-4 block text-black dark:text-white">
                  Choose your mood fruit:
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {fruityMoods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => setNewMoodData((prev) => ({ ...prev, mood: mood.name }))}
                      className={`
                        p-4 border-[3px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] 
                        hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-left
                        ${
                          newMoodData.mood === mood.name
                            ? "bg-black text-white ring-[3px] ring-yellow-400 ring-offset-2"
                            : `${mood.bgColor} hover:bg-opacity-80`
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-white rounded-sm flex items-center justify-center">
                          <MoodIcon mood={mood} size={20} />
                        </div>
                        <div>
                          <div className="font-black text-sm">{mood.name}</div>
                          <div className="text-xs opacity-70">{mood.emotion}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-lg font-black text-black dark:text-white">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="What's on your mind? Any details about your mood..."
                  value={newMoodData.note}
                  onChange={(e) => setNewMoodData((prev) => ({ ...prev, note: e.target.value }))}
                  className="mt-2 border-[3px] border-black shadow-[3px_3px_0px_#000] focus:shadow-[5px_5px_0px_#000] bg-white dark:bg-gray-800"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border-[3px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] bg-white dark:bg-gray-800 font-black"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMood}
                  disabled={!newMoodData.mood}
                  className="flex-1 border-[3px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] bg-gradient-to-r from-green-400 to-emerald-400 dark:from-green-600 dark:to-emerald-600 text-black dark:text-white font-black disabled:opacity-50"
                >
                  Log Mood
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Mood Modal */}
        <Dialog open={!!editingMood} onOpenChange={() => setEditingMood(null)}>
          <DialogContent className="border-[4px] border-black shadow-[8px_8px_0px_#000] bg-white dark:bg-gray-900 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b-[3px] border-black pb-4">
              <DialogTitle className="text-2xl font-black text-black dark:text-white">
                ✏️ Edit Your Fruity Mood
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-black mb-4 block text-black dark:text-white">
                  Update your mood fruit:
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {fruityMoods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => setEditMoodData((prev) => ({ ...prev, mood: mood.name }))}
                      className={`
                        p-4 border-[3px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] 
                        hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-left
                        ${
                          editMoodData.mood === mood.name
                            ? "bg-black text-white ring-[3px] ring-yellow-400 ring-offset-2"
                            : `${mood.bgColor} hover:bg-opacity-80`
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-white rounded-sm flex items-center justify-center">
                          <MoodIcon mood={mood} size={20} />
                        </div>
                        <div>
                          <div className="font-black text-sm">{mood.name}</div>
                          <div className="text-xs opacity-70">{mood.emotion}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes" className="text-lg font-black text-black dark:text-white">
                  Update Notes (optional)
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Update your thoughts about this mood..."
                  value={editMoodData.note}
                  onChange={(e) => setEditMoodData((prev) => ({ ...prev, note: e.target.value }))}
                  className="mt-2 border-[3px] border-black shadow-[3px_3px_0px_#000] focus:shadow-[5px_5px_0px_#000] bg-white dark:bg-gray-800"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingMood(null)}
                  className="flex-1 border-[3px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] bg-white dark:bg-gray-800 font-black"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editMoodData.mood}
                  className="flex-1 border-[3px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 text-black dark:text-white font-black disabled:opacity-50"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
