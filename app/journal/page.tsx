"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import {
  BookOpen,
  Plus,
  Sparkles,
  Brain,
  Heart,
  Trash2,
  Edit,
  X,
  AlertCircle,
  Lightbulb,
  Calendar,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"

interface JournalEntry {
  id: string
  title: string
  content: string
  selected_fruits: string[]
  analyzed_emotions: Record<string, number>
  overall_energy_level: number
  ai_insights: string
  created_at: string
  updated_at: string
}

const FRUIT_EMOTIONS = [
  { name: "Strawberry Bliss", emotion: "Happy", color: "bg-pink-200", emoji: "🍓" },
  { name: "Sour Lemon", emotion: "Frustrated", color: "bg-yellow-200", emoji: "🍋" },
  { name: "Pineapple Punch", emotion: "Excited", color: "bg-orange-200", emoji: "🍍" },
  { name: "Slippery Banana", emotion: "Anxious", color: "bg-yellow-100", emoji: "🍌" },
  { name: "Spiky Papaya", emotion: "Angry", color: "bg-red-200", emoji: "🥭" },
  { name: "Watermelon Wave", emotion: "Calm", color: "bg-green-200", emoji: "🍉" },
  { name: "Blueberry Burnout", emotion: "Exhausted", color: "bg-blue-200", emoji: "🫐" },
  { name: "Grape Expectations", emotion: "Hopeful", color: "bg-purple-200", emoji: "🍇" },
  { name: "Peachy Keen", emotion: "Content", color: "bg-orange-100", emoji: "🍑" },
  { name: "Apple Clarity", emotion: "Focused", color: "bg-green-100", emoji: "🍎" },
  { name: "Cherry Charge", emotion: "Energetic", color: "bg-red-100", emoji: "🍒" },
  { name: "Kiwi Comeback", emotion: "Determined", color: "bg-green-300", emoji: "🥝" },
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New entry form state
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [selectedFruits, setSelectedFruits] = useState<string[]>([])

  // Edit entry state
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editFruits, setEditFruits] = useState<string[]>([])

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    loadJournalEntries()
  }, [])

  const loadJournalEntries = async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Please log in to view your journal entries")
        return
      }

      const { data, error: fetchError } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Failed to load entries:", fetchError)
        setError("Failed to load journal entries")
      } else {
        setEntries(data || [])
      }
    } catch (error) {
      console.error("Error loading journal entries:", error)
      setError("Failed to load journal entries")
    } finally {
      setLoading(false)
    }
  }

  const toggleFruitSelection = (fruitName: string, isEditing = false) => {
    if (isEditing) {
      setEditFruits((prev) => (prev.includes(fruitName) ? prev.filter((f) => f !== fruitName) : [...prev, fruitName]))
    } else {
      setSelectedFruits((prev) =>
        prev.includes(fruitName) ? prev.filter((f) => f !== fruitName) : [...prev, fruitName],
      )
    }
  }

  const analyzeAndSaveEntry = async () => {
    if (!newContent.trim()) {
      setError("Please enter some content for your journal entry")
      return
    }

    try {
      setAnalyzing(true)
      setError(null)

      const response = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle || "Untitled Entry",
          content: newContent,
          selected_fruits: selectedFruits,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || `HTTP ${response.status}`)
      }

      await loadJournalEntries() // Reload entries

      // Reset form
      setNewTitle("")
      setNewContent("")
      setSelectedFruits([])
      setShowNewEntry(false)
      setError(null)
    } catch (error) {
      console.error("Error analyzing entry:", error)
      setError(`Failed to analyze and save journal entry: ${error.message}`)
    } finally {
      setAnalyzing(false)
    }
  }

  const startEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry.id)
    setEditTitle(entry.title || "")
    setEditContent(entry.content)
    setEditFruits(entry.selected_fruits || [])
  }

  const saveEditedEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: editTitle || "Untitled Entry",
          content: editContent,
          selected_fruits: editFruits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", entryId)

      if (error) {
        throw error
      }

      await loadJournalEntries()
      setEditingEntry(null)
      setError(null)
    } catch (error) {
      console.error("Error updating entry:", error)
      setError("Failed to update entry")
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) {
      return
    }

    try {
      const { error } = await supabase.from("journal_entries").delete().eq("id", entryId)

      if (error) {
        throw error
      }

      await loadJournalEntries()
      setError(null)
    } catch (error) {
      console.error("Error deleting entry:", error)
      setError("Failed to delete entry")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center">
            <div className="text-center space-y-4">
              <BookOpen className="h-12 w-12 animate-pulse mx-auto text-black" />
              <p className="text-xl font-bold">Loading your journal...</p>
            </div>
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
            {/* Error Display */}
            {error && (
              <Card className="border-[3px] border-red-500 shadow-[6px_6px_0px_#000] bg-red-100">
                <CardContent className="p-4 bg-white border-[2px] border-red-500 m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-bold">{error}</p>
                  </div>
                  <Button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm bg-red-500 text-white hover:bg-red-600 border-[2px] border-black shadow-[2px_2px_0px_#000]"
                    size="sm"
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 rounded-2xl border-[3px] border-black shadow-[8px_8px_0px_#000]" />
              <div className="relative bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] p-8 m-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black tracking-tight text-black">My Journal</h1>
                      <p className="text-lg text-gray-600 font-bold">
                        {entries.length > 0 ? `${entries.length} entries` : "Start your journaling journey"} 🧠✨
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowNewEntry(true)}
                    className="border-[3px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold px-6 py-3"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    New Entry
                  </Button>
                </div>
              </div>
            </div>

            {/* New Entry Form */}
            {showNewEntry && (
              <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-green-200 to-emerald-300">
                <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                  <CardTitle className="flex items-center justify-between text-xl font-black">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      New Journal Entry
                    </div>
                    <Button
                      onClick={() => {
                        setShowNewEntry(false)
                        setError(null)
                      }}
                      className="p-2 h-8 w-8 bg-red-400 text-white hover:bg-red-500 border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000] space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Entry Title (Optional)</label>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="What's on your mind today?"
                      className="border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold"
                    />
                  </div>

                  {/* Content Textarea */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Journal Content *</label>
                    <Textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write about your day, feelings, thoughts, or anything that comes to mind..."
                      className="border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold min-h-[200px]"
                    />
                  </div>

                  {/* Fruit Selection */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-4">
                      How are you feeling? (Select all that apply) 🍓
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {FRUIT_EMOTIONS.map((fruit) => (
                        <button
                          key={fruit.name}
                          onClick={() => toggleFruitSelection(fruit.name)}
                          className={cn(
                            "p-3 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] transition-all font-bold text-left",
                            selectedFruits.includes(fruit.name)
                              ? `${fruit.color} shadow-[4px_4px_0px_#000] translate-x-[-2px] translate-y-[-2px]`
                              : "bg-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{fruit.emoji}</span>
                            <div>
                              <div className="text-sm font-black">{fruit.name}</div>
                              <div className="text-xs text-gray-600">{fruit.emotion}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={analyzeAndSaveEntry}
                      disabled={!newContent.trim() || analyzing}
                      className="flex-1 border-[2px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold py-3"
                    >
                      {analyzing ? (
                        <>
                          <Brain className="mr-2 h-5 w-5 animate-pulse" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Analyze & Save Entry
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Journal Entries */}
            <div className="space-y-6">
              {entries.length === 0 ? (
                <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-blue-200 to-indigo-300">
                  <CardContent className="p-12 text-center bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-2xl font-black mb-2">No journal entries yet</h3>
                    <p className="text-gray-600 font-bold mb-6">Start your AI-powered journaling journey today!</p>
                    <Button
                      onClick={() => setShowNewEntry(true)}
                      className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold px-6 py-3"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Write Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                entries.map((entry) => {
                  const { date, time } = formatDate(entry.created_at)
                  const isEditing = editingEntry === entry.id

                  return (
                    <Card
                      key={entry.id}
                      className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-purple-200 to-pink-300"
                    >
                      <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {isEditing ? (
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-xl font-black border-[2px] border-black shadow-[2px_2px_0px_#000] mb-2"
                                placeholder="Entry title..."
                              />
                            ) : (
                              <CardTitle className="text-xl font-black">{entry.title || "Untitled Entry"}</CardTitle>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600 font-bold">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {time}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  onClick={() => saveEditedEntry(entry.id)}
                                  className="p-2 h-8 w-8 bg-green-400 text-white hover:bg-green-500 border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                                  size="sm"
                                >
                                  ✓
                                </Button>
                                <Button
                                  onClick={() => setEditingEntry(null)}
                                  className="p-2 h-8 w-8 bg-gray-400 text-white hover:bg-gray-500 border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                                  size="sm"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  onClick={() => startEditEntry(entry)}
                                  className="p-2 h-8 w-8 bg-blue-400 text-white hover:bg-blue-500 border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                                  size="sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteEntry(entry.id)}
                                  className="p-2 h-8 w-8 bg-red-400 text-white hover:bg-red-500 border-[2px] border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000] space-y-4">
                        {/* Journal Content */}
                        <div className="prose max-w-none">
                          {isEditing ? (
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold min-h-[150px]"
                            />
                          ) : (
                            <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                              {entry.content}
                            </p>
                          )}
                        </div>

                        {/* Selected Fruits */}
                        {(isEditing ? editFruits : entry.selected_fruits) &&
                          (isEditing ? editFruits : entry.selected_fruits).length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-black mb-2">Selected Feelings:</h4>
                              {isEditing ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                  {FRUIT_EMOTIONS.map((fruit) => (
                                    <button
                                      key={fruit.name}
                                      onClick={() => toggleFruitSelection(fruit.name, true)}
                                      className={cn(
                                        "p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000] transition-all font-bold text-left text-xs",
                                        editFruits.includes(fruit.name)
                                          ? `${fruit.color} shadow-[4px_4px_0px_#000] translate-x-[-2px] translate-y-[-2px]`
                                          : "bg-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]",
                                      )}
                                    >
                                      <div className="flex items-center gap-1">
                                        <span className="text-lg">{fruit.emoji}</span>
                                        <div>
                                          <div className="text-xs font-black">{fruit.name}</div>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {entry.selected_fruits.map((fruitName) => {
                                    const fruit = FRUIT_EMOTIONS.find((f) => f.name === fruitName)
                                    return (
                                      <Badge
                                        key={fruitName}
                                        className={cn(
                                          "border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold text-black hover:text-white",
                                          fruit?.color || "bg-gray-200",
                                        )}
                                      >
                                        {fruit?.emoji} {fruitName}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                        {/* AI Analysis */}
                        {!isEditing && entry.analyzed_emotions && Object.keys(entry.analyzed_emotions).length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              AI Emotion Analysis:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(entry.analyzed_emotions).map(([emotion, percentage]) => (
                                <div
                                  key={emotion}
                                  className="bg-gradient-to-r from-indigo-200 to-purple-200 border-[2px] border-black rounded-lg p-2 shadow-[2px_2px_0px_#000]"
                                >
                                  <div className="text-xs font-bold capitalize">{emotion.replace(/_/g, " ")}</div>
                                  <div className="text-lg font-black">{percentage}%</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Insights */}
                        {!isEditing && entry.ai_insights && (
                          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 border-[2px] border-black rounded-lg p-4 shadow-[2px_2px_0px_#000]">
                            <h4 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              AI Insights:
                            </h4>
                            <p className="text-sm text-gray-800 font-medium">{entry.ai_insights}</p>
                          </div>
                        )}

                        {/* Energy Level */}
                        {!isEditing && entry.overall_energy_level !== undefined && (
                          <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-200 to-emerald-200 border-[2px] border-black rounded-lg shadow-[2px_2px_0px_#000]">
                            <Heart className="h-5 w-5 text-red-500" />
                            <div className="flex-1">
                              <div className="text-sm font-bold">Energy Level</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white border-[2px] border-black rounded-full h-3 shadow-[2px_2px_0px_#000]">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full border-[1px] border-black"
                                    style={{ width: `${entry.overall_energy_level}%` }}
                                  />
                                </div>
                                <span className="text-sm font-black">{entry.overall_energy_level}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
