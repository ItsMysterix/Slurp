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
  Heart,
  Plus,
  Sparkles,
  Sun,
  Star,
  Trash2,
  Edit,
  X,
  AlertCircle,
  Calendar,
  Clock,
  Smile,
  Gift,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"

interface GratitudeEntry {
  id: string
  title: string
  content: string
  gratitude_items: string[]
  created_at: string
  updated_at: string
}

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who are you thankful for and why?",
  "What's something beautiful you noticed today?",
  "What challenge helped you grow recently?",
  "What simple pleasure brought you joy?",
  "What opportunity are you grateful for?",
  "What about your health are you thankful for?",
  "What memory makes you feel warm inside?",
  "What skill or talent are you grateful to have?",
  "What act of kindness touched your heart recently?",
]

const GRATITUDE_CATEGORIES = [
  { name: "Family & Friends", emoji: "👨‍👩‍👧‍👦", color: "bg-pink-200" },
  { name: "Health & Wellness", emoji: "💪", color: "bg-green-200" },
  { name: "Nature & Beauty", emoji: "🌸", color: "bg-purple-200" },
  { name: "Opportunities", emoji: "🚪", color: "bg-blue-200" },
  { name: "Simple Pleasures", emoji: "☕", color: "bg-yellow-200" },
  { name: "Personal Growth", emoji: "🌱", color: "bg-emerald-200" },
  { name: "Acts of Kindness", emoji: "🤝", color: "bg-orange-200" },
  { name: "Achievements", emoji: "🏆", color: "bg-indigo-200" },
]

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New entry form state
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newGratitudeItems, setNewGratitudeItems] = useState<string[]>([])
  const [currentGratitudeItem, setCurrentGratitudeItem] = useState("")

  // Edit entry state
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editGratitudeItems, setEditGratitudeItems] = useState<string[]>([])

  // Random prompt
  const [todayPrompt, setTodayPrompt] = useState("")

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    loadGratitudeEntries()
    setTodayPrompt(GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)])
  }, [])

  const loadGratitudeEntries = async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Please log in to view your gratitude journal")
        return
      }

      const { data, error: fetchError } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_type", "gratitude")
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Failed to load gratitude entries:", fetchError)
        setError("Failed to load gratitude entries")
      } else {
        setEntries(data || [])
      }
    } catch (error) {
      console.error("Error loading gratitude entries:", error)
      setError("Failed to load gratitude entries")
    } finally {
      setLoading(false)
    }
  }

  const addGratitudeItem = () => {
    if (currentGratitudeItem.trim()) {
      setNewGratitudeItems([...newGratitudeItems, currentGratitudeItem.trim()])
      setCurrentGratitudeItem("")
    }
  }

  const removeGratitudeItem = (index: number) => {
    setNewGratitudeItems(newGratitudeItems.filter((_, i) => i !== index))
  }

  const saveGratitudeEntry = async () => {
    if (!newContent.trim() && newGratitudeItems.length === 0) {
      setError("Please add some gratitude content or items")
      return
    }

    try {
      setSaving(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Please log in to save your gratitude entry")
        return
      }

      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: newTitle || "Gratitude Entry",
        content: newContent,
        entry_type: "gratitude",
        gratitude_items: newGratitudeItems,
        created_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      await loadGratitudeEntries()

      // Reset form
      setNewTitle("")
      setNewContent("")
      setNewGratitudeItems([])
      setCurrentGratitudeItem("")
      setShowNewEntry(false)
      setError(null)
    } catch (error) {
      console.error("Error saving gratitude entry:", error)
      setError(`Failed to save gratitude entry: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const startEditEntry = (entry: GratitudeEntry) => {
    setEditingEntry(entry.id)
    setEditTitle(entry.title || "")
    setEditContent(entry.content)
    setEditGratitudeItems(entry.gratitude_items || [])
  }

  const saveEditedEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: editTitle || "Gratitude Entry",
          content: editContent,
          gratitude_items: editGratitudeItems,
          updated_at: new Date().toISOString(),
        })
        .eq("id", entryId)

      if (error) {
        throw error
      }

      await loadGratitudeEntries()
      setEditingEntry(null)
      setError(null)
    } catch (error) {
      console.error("Error updating entry:", error)
      setError("Failed to update entry")
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this gratitude entry?")) {
      return
    }

    try {
      const { error } = await supabase.from("journal_entries").delete().eq("id", entryId)

      if (error) {
        throw error
      }

      await loadGratitudeEntries()
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
              <Heart className="h-12 w-12 animate-pulse mx-auto text-pink-500" />
              <p className="text-xl font-bold">Loading your gratitude journal...</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-yellow-200 to-orange-200 rounded-2xl border-[3px] border-black shadow-[8px_8px_0px_#000]" />
              <div className="relative bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] p-8 m-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-pink-400 to-orange-400 p-3 rounded-xl border-[2px] border-black shadow-[4px_4px_0px_#000]">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black tracking-tight text-black">Gratitude Journal</h1>
                      <p className="text-lg text-gray-600 font-bold">
                        {entries.length > 0 ? `${entries.length} grateful moments` : "Start counting your blessings"}{" "}
                        🙏✨
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowNewEntry(true)}
                    className="border-[3px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold px-6 py-3"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    New Entry
                  </Button>
                </div>
              </div>
            </div>

            {/* Daily Prompt */}
            <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-yellow-200 to-orange-300">
              <CardContent className="p-6 bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                    <Sun className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black">Today's Gratitude Prompt</h3>
                </div>
                <p className="text-lg font-bold text-gray-700 italic">"{todayPrompt}"</p>
              </CardContent>
            </Card>

            {/* New Entry Form */}
            {showNewEntry && (
              <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-green-200 to-emerald-300">
                <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                  <CardTitle className="flex items-center justify-between text-xl font-black">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      New Gratitude Entry
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
                      placeholder="What are you grateful for today?"
                      className="border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold"
                    />
                  </div>

                  {/* Gratitude Items */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Things I'm Grateful For 🙏</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={currentGratitudeItem}
                        onChange={(e) => setCurrentGratitudeItem(e.target.value)}
                        placeholder="Add something you're grateful for..."
                        className="border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold flex-1"
                        onKeyPress={(e) => e.key === "Enter" && addGratitudeItem()}
                      />
                      <Button
                        onClick={addGratitudeItem}
                        className="border-[2px] border-black shadow-[2px_2px_0px_#000] bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {newGratitudeItems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newGratitudeItems.map((item, index) => (
                          <Badge
                            key={index}
                            className="border-[2px] border-black shadow-[2px_2px_0px_#000] bg-gradient-to-r from-pink-200 to-orange-200 text-black font-bold cursor-pointer hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                            onClick={() => removeGratitudeItem(index)}
                          >
                            {item} ✕
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content Textarea */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Reflection (Optional)</label>
                    <Textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write about why you're grateful for these things, how they make you feel, or any other thoughts..."
                      className="border-[2px] border-black shadow-[2px_2px_0px_#000] font-bold min-h-[150px]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={saveGratitudeEntry}
                      disabled={(!newContent.trim() && newGratitudeItems.length === 0) || saving}
                      className="flex-1 border-[2px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold py-3"
                    >
                      {saving ? (
                        <>
                          <Heart className="mr-2 h-5 w-5 animate-pulse" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Save Gratitude Entry
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gratitude Categories */}
            <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-purple-200 to-pink-300">
              <CardHeader className="border-b-[2px] border-black pb-3 bg-white">
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000]">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  Gratitude Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GRATITUDE_CATEGORIES.map((category) => (
                    <div
                      key={category.name}
                      className={cn(
                        "p-3 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] text-center font-bold hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer",
                        category.color,
                      )}
                    >
                      <div className="text-2xl mb-1">{category.emoji}</div>
                      <div className="text-xs">{category.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gratitude Entries */}
            <div className="space-y-6">
              {entries.length === 0 ? (
                <Card className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-blue-200 to-indigo-300">
                  <CardContent className="p-12 text-center bg-white border-[2px] border-black m-2 rounded-lg shadow-[4px_4px_0px_#000]">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-pink-400" />
                    <h3 className="text-2xl font-black mb-2">Start Your Gratitude Journey</h3>
                    <p className="text-gray-600 font-bold mb-6">
                      Begin counting your blessings and watch your happiness grow! 🌱
                    </p>
                    <Button
                      onClick={() => setShowNewEntry(true)}
                      className="border-[2px] border-black shadow-[4px_4px_0px_#000] bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all font-bold px-6 py-3"
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
                      className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-gradient-to-br from-pink-200 to-orange-300"
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
                              <CardTitle className="text-xl font-black flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                {entry.title || "Gratitude Entry"}
                              </CardTitle>
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
                        {/* Gratitude Items */}
                        {entry.gratitude_items && entry.gratitude_items.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
                              <Smile className="h-4 w-4" />
                              I'm grateful for:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.gratitude_items.map((item, index) => (
                                <Badge
                                  key={index}
                                  className="border-[2px] border-black shadow-[2px_2px_0px_#000] bg-gradient-to-r from-yellow-200 to-orange-200 text-black font-bold"
                                >
                                  ✨ {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Journal Content */}
                        {entry.content && (
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
