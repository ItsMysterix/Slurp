"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MoodOption {
  emoji: string
  label: string
  description: string
  bgColor: string
}

export function MoodSelector() {
  // TODO: handle selected mood in React state
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customEmoji, setCustomEmoji] = useState("🍎")
  const [customLabel, setCustomLabel] = useState("")

  const moodOptions: MoodOption[] = [
    {
      emoji: "🍋",
      label: "Sour Citrus",
      description: "Annoyed",
      bgColor: "bg-yellow-100",
    },
    {
      emoji: "🍓",
      label: "Sweetberry Bliss",
      description: "Happy",
      bgColor: "bg-pink-100",
    },
    {
      emoji: "🫐",
      label: "Blueberry Burnout",
      description: "Exhausted",
      bgColor: "bg-blue-100",
    },
    {
      emoji: "🍍",
      label: "Spiky Papaya",
      description: "Stressed",
      bgColor: "bg-orange-100",
    },
    {
      emoji: "🍑",
      label: "Peachy Keen",
      description: "Content",
      bgColor: "bg-orange-50",
    },
    {
      emoji: "🍌",
      label: "Slippery Mood",
      description: "Confused",
      bgColor: "bg-yellow-50",
    },
    {
      emoji: "🍇",
      label: "Grape Expectations",
      description: "Hopeful",
      bgColor: "bg-purple-100",
    },
    {
      emoji: "🍉",
      label: "Watermelon Wave",
      description: "Peaceful",
      bgColor: "bg-green-100",
    },
  ]

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood)
    setShowCustomInput(false)
  }

  const handleCustomMoodSubmit = () => {
    if (customLabel.trim()) {
      const customMood = {
        emoji: customEmoji,
        label: customLabel,
        description: "Custom",
        bgColor: "bg-gray-100",
      }

      // TODO: store custom mood
      setSelectedMood(customMood)
      setShowCustomInput(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">How are you feeling right now?</h2>
        <p className="text-gray-600">Select the fruity mood that best describes you</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {moodOptions.map((mood) => (
          <Card
            key={mood.label}
            className={cn(
              "border-2 border-black rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1",
              mood.bgColor,
              selectedMood?.label === mood.label && "ring-4 ring-black ring-offset-2",
            )}
            onClick={() => handleMoodSelect(mood)}
          >
            <div className="p-4 flex flex-col items-center text-center">
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <h3 className="font-bold text-sm sm:text-base">{mood.label}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{mood.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          Feeling something else?
        </Button>
      </div>

      {showCustomInput && (
        <Card className="mt-4 p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="emoji-picker" className="block mb-2 font-medium">
                Choose an emoji
              </Label>
              <div className="flex gap-2 flex-wrap">
                {["🍎", "🍐", "🥭", "🥝", "🍊", "🫐", "🍒"].map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-10 w-10 rounded-full p-0 text-lg",
                      customEmoji === emoji && "bg-gray-200 ring-2 ring-black",
                    )}
                    onClick={() => setCustomEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="custom-mood" className="block mb-2 font-medium">
                Your fruity mood metaphor
              </Label>
              <div className="flex gap-2">
                <Input
                  id="custom-mood"
                  placeholder="e.g., Mango Madness"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="border-2 border-black rounded-lg"
                />
                <Button
                  onClick={handleCustomMoodSubmit}
                  className="bg-black text-white hover:bg-gray-800 rounded-lg"
                  disabled={!customLabel.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedMood && (
        <div className="mt-6 p-4 border-2 border-black rounded-xl bg-green-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-medium">
            Selected mood:{" "}
            <span className="font-bold">
              {selectedMood.emoji} {selectedMood.label}
            </span>
          </p>
          {/* TODO: integrate with backend later */}
        </div>
      )}
    </div>
  )
}
