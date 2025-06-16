"use client"

import { format, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface DailyCalendarViewProps {
  currentDate: Date
  moodEntries: any[]
}

export function DailyCalendarView({ currentDate, moodEntries }: DailyCalendarViewProps) {
  // Get moods for the current day
  const dayMoods = moodEntries.filter((entry) => isSameDay(entry.date, currentDate))

  // Create time slots for the day (hourly)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12
    const amPm = i < 12 ? "AM" : "PM"
    return `${hour}:00 ${amPm}`
  })

  return (
    <Card className="neubrutal bg-white">
      <CardHeader className="border-b-2 border-black pb-3">
        <CardTitle className="text-xl">{format(currentDate, "EEEE, MMMM d, yyyy")}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {timeSlots.map((timeSlot, index) => {
            // Find mood entries that fall within this hour
            const moodsInSlot = dayMoods.filter((mood) => {
              const [hourStr, minuteStr] = mood.time.split(":")
              const hour = Number.parseInt(hourStr)
              const isPM = mood.time.includes("PM") && hour !== 12
              const is12AM = mood.time.includes("AM") && hour === 12
              const hourIn24 = is12AM ? 0 : isPM ? hour + 12 : hour
              return hourIn24 === index
            })

            return (
              <div
                key={timeSlot}
                className={`flex items-start gap-3 rounded-lg border-2 p-2 ${
                  moodsInSlot.length > 0 ? "border-black" : "border-gray-200"
                }`}
              >
                <div className="flex w-16 flex-shrink-0 items-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {timeSlot}
                </div>

                <div className="flex-1">
                  {moodsInSlot.length > 0 ? (
                    moodsInSlot.map((mood) => (
                      <div key={mood.id} className={`rounded-lg ${mood.color} p-2`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{mood.emoji}</span>
                          <span className="font-medium">{mood.mood}</span>
                          <span className="text-xs">{mood.time}</span>
                        </div>
                        <p className="mt-1 text-sm">{mood.note}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No mood entries</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
