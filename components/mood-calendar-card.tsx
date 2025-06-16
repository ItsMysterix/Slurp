"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// TODO: Map future moods to fruity metaphors dynamically
const fruitMoodMap = {
  "😊": { emoji: "🍓", name: "Sweetberry Bliss", color: "bg-pink-100" },
  "😐": { emoji: "🍋", name: "Sour Citrus", color: "bg-yellow-100" },
  "😔": { emoji: "🫐", name: "Blueberry Burnout", color: "bg-blue-100" },
  "😡": { emoji: "🍍", name: "Spiky Papaya", color: "bg-orange-100" },
  "😌": { emoji: "🍑", name: "Peachy Keen", color: "bg-peach" },
  "😓": { emoji: "🍌", name: "Slippery Mood", color: "bg-yellow-50" },
}

export function MoodCalendarCard() {
  // Mock data for the calendar
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3 // Start from previous month
    if (day <= 0 || day > 31) return { day: day <= 0 ? 30 + day : day - 31, currentMonth: false, mood: null }

    // Randomly assign moods to some days
    const moods = ["😊", "😐", "😔", "😡", "😌", "😓", null]
    const moodIndex = Math.floor(Math.random() * moods.length)
    const mood = moods[moodIndex]

    return {
      day,
      currentMonth: true,
      mood: mood ? fruitMoodMap[mood]?.emoji || null : null,
      color: mood ? fruitMoodMap[mood]?.color || "" : "",
    }
  })

  return (
    <Card className="neubrutal bg-white">
      <CardHeader className="border-b-2 border-black pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            Mood Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <span className="text-sm font-medium">June 2025</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="py-1 text-xs font-medium">
              {day}
            </div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              className={`
                flex aspect-square items-center justify-center rounded-lg border-2 p-1
                ${day.currentMonth ? "border-black" : "border-gray-200 opacity-40"}
                ${day.color}
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs">{day.day}</span>
                {day.mood && <span className="text-sm">{day.mood}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button asChild className="neubrutal-sm bg-black text-white">
            <Link href="/calendar">View Full Calendar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
