"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { PrivateModeToggle } from "@/components/private-mode-toggle"

interface MoodOption {
  id: string
  name: string
  emoji: string
  emotion: string
  bgColor: string
}

// TODO: Map future moods to fruity metaphors dynamically
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

export default function AddSlurpPage() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null)
  const [note, setNote] = useState("")
  const [storageMode, setStorageMode] = useState<"local" | "cloud">("local")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check current mode from localStorage on page load
  useEffect(() => {
    const savedMode = localStorage.getItem("slurpMode") as "local" | "cloud" | null
    if (savedMode) {
      setStorageMode(savedMode)
    }
  }, [])

  const handleModeChange = (mode: "local" | "cloud") => {
    setStorageMode(mode)
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select your fruity mood!")
      return
    }

    setIsSubmitting(true)

    try {
      // Create payload from mood + note
      const payload = {
        mood: selectedMood.name,
        emoji: selectedMood.emoji,
        emotion: selectedMood.emotion,
        note: note,
        timestamp: new Date().toISOString(),
      }

      // Add logic for conditionally saving mood entry based on mode
      if (storageMode === "local") {
        // Save to localStorage
        const existingEntries = JSON.parse(localStorage.getItem("slurpMoodEntries") || "[]")
        existingEntries.push(payload)
        localStorage.setItem("slurpMoodEntries", JSON.stringify(existingEntries))

        // Show local storage toast
        toast.success("🍑 Mood stored locally", {
          description: "Your entry is saved only on this device",
        })
      } else {
        // Save to Supabase
        // const { error } = await supabase.from("mood_entries").insert(payload)
        // if (error) throw error

        // Mock Supabase insert for now
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Show cloud storage toast
        toast.success("☁️ Mood saved to cloud", {
          description: "Your entry is synced to your account",
        })
      }

      // Reset form
      setSelectedMood(null)
      setNote("")
    } catch (error) {
      console.error("Error saving mood entry:", error)
      toast.error("Failed to save your mood entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-pink-100 p-4 font-sans">
      {/* Private Mode Toggle */}
      <PrivateModeToggle onModeChange={handleModeChange} />

      <div className="mt-4 flex flex-1 items-center justify-center">
        <Card className="w-full max-w-lg rounded-xl border-2 border-black bg-cream shadow-neubrutal">
          <CardHeader className="border-b-2 border-black p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold tracking-tight text-black">How's your flavor today?</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md border-2 border-black shadow-neubrutal-sm hover:shadow-neubrutal-hover active:shadow-neubrutal-active"
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-6 w-6 text-black" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">
            <div>
              <Label className="mb-3 block text-lg font-semibold text-black">Pick your fruity mood:</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:flex md:flex-wrap md:justify-start md:gap-4">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood)}
                    variant="outline"
                    className={`
                      h-auto w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-black p-3 text-sm font-semibold
                      shadow-neubrutal-sm transition-all hover:shadow-neubrutal-hover active:shadow-neubrutal-active md:w-auto md:min-w-[120px] md:px-4 md:py-3
                      ${mood.bgColor}
                      ${selectedMood?.id === mood.id ? "ring-4 ring-black ring-offset-2" : ""}
                    `}
                  >
                    <span className="text-3xl md:text-4xl">{mood.emoji}</span>
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
                className="min-h-[120px] w-full rounded-md border-2 border-black bg-white p-4 text-base text-black shadow-neubrutal-sm focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className="w-full rounded-lg border-2 border-black bg-red-400 px-6 py-4 text-lg font-bold text-white shadow-neubrutal transition-all hover:bg-red-500 hover:shadow-neubrutal-hover active:bg-red-500 active:shadow-neubrutal-active disabled:opacity-70 disabled:shadow-none"
            >
              {isSubmitting ? "Saving..." : "Save My Slurp"}
            </Button>

            {/* Storage mode indicator */}
            <div className="text-center text-sm text-black/60">
              {storageMode === "local" ? (
                <span>🍑 Private mode: Entries stored only on this device</span>
              ) : (
                <span>☁️ Cloud mode: Entries synced to your account</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
