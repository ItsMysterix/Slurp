"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// TODO: Map future moods to fruity metaphors dynamically
const quickMoods = [
  { id: "sweetberry", name: "Sweetberry Bliss", emoji: "🍓", emotion: "Happy", bgColor: "bg-pink-100" },
  { id: "citrus", name: "Sour Citrus", emoji: "🍋", emotion: "Annoyed", bgColor: "bg-yellow-100" },
  { id: "blueberry", name: "Blueberry Burnout", emoji: "🫐", emotion: "Exhausted", bgColor: "bg-blue-100" },
  { id: "papaya", name: "Spiky Papaya", emoji: "🍍", emotion: "Stressed", bgColor: "bg-orange-100" },
  { id: "peach", name: "Peachy Keen", emoji: "🍑", emotion: "Content", bgColor: "bg-peach" },
  { id: "grape", name: "Grape Expectations", emoji: "🍇", emotion: "Hopeful", bgColor: "bg-purple-100" },
]

export function MoodEntryCard() {
  return (
    <Card className="neubrutal bg-strawberry">
      <CardHeader className="border-b-2 border-black pb-3">
        <CardTitle className="text-xl">Quick Mood Entry</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 text-center">
          <p className="text-lg font-medium">How are you feeling right now?</p>
          <p className="text-sm text-muted-foreground">Track your fruity mood in seconds</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {quickMoods.map((mood) => (
            <Button
              key={mood.id}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 border-black ${mood.bgColor} p-3 text-black shadow-neubrutal-sm hover:shadow-neubrutal`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-bold">{mood.name}</span>
              <span className="text-[10px] text-gray-600">{mood.emotion}</span>
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <Button asChild className="w-full neubrutal-sm bg-black text-white">
            <Link href="/mood/new" className="flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>More Options</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
