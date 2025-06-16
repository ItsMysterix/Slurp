"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import { BackgroundIllustrations } from "@/components/background-illustrations"
import { getMoodEntryById, updateMoodEntry } from "@/actions/mood-actions"
import { useAuth } from "@/contexts/auth-context"

interface MoodOption {
  id: string
  name: string
  emoji: string
  emotion: string
  bgColor: string
}

export default function EditMoodPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null)
  const [note, setNote] = useState("")
  const [location, setLocation] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mood options
  const moodOptions: MoodOption[] = [
    { id: "sweetberry", name: "Sweetberry Bliss", emoji: "🍓", emotion: "Happy", bgColor: "bg-pink-100" },
    { id: "citrus", name: "Sour Citrus", emoji: "🍋", emotion: "Annoyed", bgColor: "bg-yellow-100" },
    { id: "blueberry", name: "Blueberry Burnout", emoji: "🫐", emotion: "Exhausted", bgColor: "bg-blue-100" },
    { id: "papaya", name: "Spiky Papaya", emoji: "🍍", emotion: "Stressed", bgColor: "bg-orange-100" },
    { id: "banana", name: "Slippery Mood", emoji: "🍌", emotion: "Confused", bgColor: "bg-yellow-50" },
    { id: "peach", name: "Peachy Keen", emoji: "🍑", emotion: "Content", bgColor: "bg-peach" },
    { id: "watermelon", name: "Watermelon Wave", emoji: "🍉", emotion: "Peaceful", bgColor: "bg-green-100" },
    { id: "grape", name: "Grape Expectations", emoji: "🍇", emotion: "Hopeful", bgColor: "bg-purple-100" },
  ]

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }

    const fetchMoodEntry = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        const result = await getMoodEntryById(params.id as string)

        if (result.success && result.data) {
          const entry = result.data
          setNote(entry.note || "")
          setLocation(entry.location || "")
          setIsPrivate(entry.is_private || false)

          // Find matching mood option
          const matchingMood = moodOptions.find((mood) => mood.name === entry.mood_name || mood.emoji === entry.emoji)

          if (matchingMood) {
            setSelectedMood(matchingMood)
          } else {
            // Create custom mood option if no match found
            const customMood: MoodOption = {
              id: "custom",
              name: entry.mood_name,
              emoji: entry.emoji,
              emotion: entry.emotion,
              bgColor: entry.bg_color,
            }
            setSelectedMood(customMood)
          }
        } else {
          setError(result.error || "Failed to fetch mood entry")
        }
      } catch (err) {
        setError((err as Error).message || "An error occurred while fetching the mood entry")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodEntry()
  }, [user, params.id, router, moodOptions])

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood)
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select your mood flavor!")
      return
    }

    if (!params.id) {
      toast.error("Missing mood entry ID")
      return
    }

    setIsSubmitting(true)

    try {
      // Update mood entry using server action
      const result = await updateMoodEntry(params.id as string, {
        mood_name: selectedMood.name,
        emoji: selectedMood.emoji,
        emotion: selectedMood.emotion,
        note: note,
        bg_color: selectedMood.bgColor,
        location: location || undefined,
        is_private: isPrivate,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to update mood entry")
      }

      toast.success("Mood updated successfully! 🍹")
      router.push("/slurp")
    } catch (error) {
      console.error("Error updating slurp:", error)
      toast.error("Oops! Couldn't update your slurp. Please try again.", {
        description: (error as Error).message || "An unknown error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-pink-100 font-sans">
        <NavBar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-black" />
            <p className="mt-2">Loading mood entry...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-pink-100 font-sans">
        <NavBar />
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-lg rounded-xl border-2 border-black bg-cream shadow-[6px_6px_0px_#000]">
            <CardHeader className="border-b-2 border-black p-6">
              <CardTitle className="text-3xl font-bold tracking-tight text-black">Error</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4 text-lg">{error}</p>
              <Button
                asChild
                className="w-full rounded-lg border-2 border-black bg-blue-400 px-6 py-4 text-lg font-bold text-black shadow-[4px_4px_0px_#000] transition-all hover:bg-blue-500 hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000]"
              >
                <Link href="/slurp">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-pink-100 font-sans">
      <BackgroundIllustrations variant="add" />
      <NavBar />

      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg rounded-xl border-2 border-black bg-cream shadow-[6px_6px_0px_#000]">
          <CardHeader className="border-b-2 border-black p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold tracking-tight text-black">Edit Your Mood</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md border-2 border-black shadow-neubrutal-sm hover:shadow-neubrutal-hover active:shadow-neubrutal-active"
                asChild
              >
                <Link href="/slurp">
                  <ArrowLeft className="h-6 w-6 text-black" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">
            <div>
              <Label className="mb-3 block text-lg font-semibold text-black">Pick your flavor:</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood)}
                    variant="outline"
                    className={`
                      h-auto w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-black p-3 text-sm font-semibold
                      shadow-neubrutal-sm transition-all hover:shadow-neubrutal-hover active:shadow-neubrutal-active
                      ${mood.bgColor}
                      ${selectedMood?.id === mood.id ? "ring-4 ring-black ring-offset-2" : ""}
                    `}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <div className="mt-1 flex flex-col items-center">
                      <span className="text-center text-black text-xs font-bold leading-tight">{mood.name}</span>
                      <span className="text-center text-gray-500 text-[10px] leading-tight">{mood.emotion}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="note" className="text-lg font-semibold text-black">
                Tell us why (optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's making your day this flavor?"
                className="min-h-[120px] w-full rounded-md border-2 border-black bg-white p-4 text-base text-black shadow-[3px_3px_0px_#000] focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-lg font-semibold text-black">
                Where are you? (optional)
              </Label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Home, Work, Coffee Shop, etc."
                className="w-full rounded-md border-2 border-black bg-white p-4 text-base text-black shadow-[3px_3px_0px_#000] focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 rounded border-2 border-black"
              />
              <Label htmlFor="private" className="text-sm font-medium text-black">
                Make this entry private (only visible to you)
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-lg border-2 border-black bg-white px-6 py-4 text-lg font-bold text-black shadow-[4px_4px_0px_#000] transition-all hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000]"
              >
                <Link href="/slurp">Cancel</Link>
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 rounded-lg border-2 border-black bg-blue-400 px-6 py-4 text-lg font-bold text-black shadow-[4px_4px_0px_#000] transition-all hover:bg-blue-500 hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mx-auto h-6 w-6 animate-spin text-white" /> : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
