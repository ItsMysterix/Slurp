"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock } from "lucide-react"
import Link from "next/link"

const recentMoods = [
  {
    id: "1",
    date: "Today, 2:30 PM",
    mood: "Sweetberry Bliss",
    emoji: "🍓",
    emotion: "Happy",
    note: "Had a great lunch with colleagues. The project presentation went well!",
    color: "bg-pink-100",
  },
  {
    id: "2",
    date: "Today, 9:15 AM",
    mood: "Spiky Papaya",
    emoji: "🍍",
    emotion: "Stressed",
    note: "Feeling nervous about the big presentation today.",
    color: "bg-orange-100",
  },
  {
    id: "3",
    date: "Yesterday, 8:45 PM",
    mood: "Peachy Keen",
    emoji: "🍑",
    emotion: "Content",
    note: "Evening yoga session really helped me unwind after a busy day.",
    color: "bg-peach",
  },
  {
    id: "4",
    date: "Yesterday, 1:20 PM",
    mood: "Sour Citrus",
    emoji: "🍋",
    emotion: "Annoyed",
    note: "Meeting ran over time and we didn't resolve the main issues.",
    color: "bg-yellow-100",
  },
]

export function RecentMoodsCard() {
  return (
    <Card className="neubrutal bg-white">
      <CardHeader className="border-b-2 border-black pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            Recent Moods
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href="/calendar">
              View All
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y-2 divide-black">
          {recentMoods.map((mood) => (
            <div key={mood.id} className={`flex items-start gap-3 p-4 ${mood.color}`}>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-2xl shadow-neubrutal-sm">
                {mood.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{mood.mood}</h3>
                    <p className="text-xs text-gray-500">{mood.emotion}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{mood.date}</span>
                </div>
                <p className="mt-1 text-sm">{mood.note}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
