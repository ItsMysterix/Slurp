"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Mood {
  emoji: string
  name: string
  emotion: string
  color: string
}

function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)

  const moods: Mood[] = [
    { emoji: "🍓", name: "Sweetberry Bliss", emotion: "Happy", color: "bg-pink-100" },
    { emoji: "🍑", name: "Peachy Keen", emotion: "Content", color: "bg-peach" },
    { emoji: "🍌", name: "Banana Balance", emotion: "Calm", color: "bg-yellow-100" },
    { emoji: "🥝", name: "Kiwi Confusion", emotion: "Uncertain", color: "bg-green-100" },
    { emoji: "🍋", name: "Sour Citrus", emotion: "Annoyed", color: "bg-yellow-100" },
    { emoji: "🍎", name: "Apple Anger", emotion: "Frustrated", color: "bg-red-100" },
    { emoji: "🫐", name: "Blueberry Burnout", emotion: "Exhausted", color: "bg-blue-100" },
    { emoji: "🍉", name: "Watermelon Wonder", emotion: "Amazed", color: "bg-green-100" },
  ]

  return (
    <div className="w-full">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {moods.map((mood) => (
          <Card
            key={mood.name}
            className={`border-2 border-black ${
              selectedMood?.name === mood.name ? "ring-4 ring-black" : ""
            } cursor-pointer shadow-[3px_3px_0px_#000] transition-all hover:shadow-[5px_5px_0px_#000] hover:-translate-y-1`}
            onClick={() => setSelectedMood(mood)}
          >
            <CardContent className={`flex items-center p-4 ${mood.color}`}>
              <div className="mr-3 text-3xl">{mood.emoji}</div>
              <div>
                <h3 className="font-bold text-black">{mood.name}</h3>
                <p className="text-xs text-gray-700">{mood.emotion}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMood && (
        <div className="flex flex-col items-center">
          <div
            className={`mb-4 flex items-center rounded-full border-2 border-black ${selectedMood.color} px-6 py-3 shadow-[3px_3px_0px_#000]`}
          >
            <span className="mr-2 text-2xl">{selectedMood.emoji}</span>
            <span className="font-bold text-black">{selectedMood.name}</span>
            <span className="ml-2 text-sm text-gray-700">({selectedMood.emotion})</span>
          </div>

          <Button className="rounded-full border-2 border-black bg-orange-200 px-8 py-6 text-lg font-bold text-black shadow-[4px_4px_0px_#000] transition-all hover:bg-orange-300 hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000]">
            Save This Mood 🎉
          </Button>
        </div>
      )}
    </div>
  )
}

// Named export
export { MoodSelector }

// Default export for compatibility
export default MoodSelector
