"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { insertMood, type Mood } from "@/lib/supabase-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

const moodOptions = [
  { type: "Happy", fruit: "Strawberry Bliss", icon: "🍓", color: "bg-pink-100" },
  { type: "Excited", fruit: "Cherry Charge", icon: "🍒", color: "bg-red-100" },
  { type: "Content", fruit: "Peachy Keen", icon: "🍑", color: "bg-peach" },
  { type: "Calm", fruit: "Grape Expectations", icon: "🍇", color: "bg-purple-100" },
  { type: "Stressed", fruit: "Spiky Papaya", icon: "🍍", color: "bg-orange-100" },
  { type: "Anxious", fruit: "Sour Citrus", icon: "🍋", color: "bg-yellow-100" },
  { type: "Sad", fruit: "Blueberry Burnout", icon: "🫐", color: "bg-blue-100" },
  { type: "Angry", fruit: "Fiery Guava", icon: "🔥", color: "bg-red-200" },
]

interface MoodEntryModalProps {
  onMoodAdded?: (mood: Mood) => void
  trigger?: React.ReactNode
}

export function MoodEntryModal({ onMoodAdded, trigger }: MoodEntryModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState<(typeof moodOptions)[0] | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user || !selectedMood) return

    setIsSubmitting(true)
    try {
      const newMood = await insertMood({
        user_id: user.id,
        mood_type: selectedMood.type,
        fruit_label: selectedMood.fruit,
        icon_url: `/images/${selectedMood.fruit.toLowerCase().replace(/\s+/g, "-")}.png`,
        timestamp: new Date().toISOString(),
        notes: notes.trim() || undefined,
      })

      if (newMood) {
        toast.success(`${selectedMood.fruit} mood logged! 🎉`)
        onMoodAdded?.(newMood)
        setOpen(false)
        setSelectedMood(null)
        setNotes("")
      } else {
        toast.error("Failed to log mood. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting mood:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button className="neubrutal-sm bg-strawberry text-black hover:text-white">
      <Plus className="h-4 w-4 mr-2" />
      Add Mood
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md neubrutal bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">🍹 How are you feeling?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Choose your mood fruit:</Label>
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.type}
                  onClick={() => setSelectedMood(mood)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${
                      selectedMood?.type === mood.type
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }
                    ${mood.color}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mood.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{mood.fruit}</div>
                      <div className="text-xs opacity-70">{mood.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="What's on your mind? Any details about your mood..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 border-2 border-gray-300 focus:border-black"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className="flex-1 neubrutal-sm bg-black text-white"
            >
              {isSubmitting ? "Logging..." : "Log Mood"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
