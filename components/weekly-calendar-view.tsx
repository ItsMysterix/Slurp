"use client"

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"

interface WeeklyCalendarViewProps {
  currentDate: Date
  moodEntries: any[]
  onDayClick: (day: Date) => void
}

export function WeeklyCalendarView({ currentDate, moodEntries, onDayClick }: WeeklyCalendarViewProps) {
  // Get days in current week
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Get mood for a specific day
  const getMoodForDay = (day: Date) => {
    return moodEntries.find((entry) => isSameDay(entry.date, day))
  }

  return (
    <Card className="neubrutal bg-white">
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {/* Day names header */}
          {daysInWeek.map((day) => (
            <div key={day.toString()} className="text-center font-semibold">
              {format(day, "EEE")}
              <br />
              {format(day, "MMM d")}
            </div>
          ))}

          {/* Calendar days with hour slots */}
          {daysInWeek.map((day) => {
            const isToday = isSameDay(day, new Date())
            const mood = getMoodForDay(day)

            return (
              <div
                key={day.toString()}
                onClick={() => onDayClick(day)}
                className={`
                  min-h-[200px] cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-neubrutal-sm
                  ${isToday ? "border-black font-bold" : "border-gray-200"}
                `}
              >
                {mood && (
                  <div
                    className={`mb-2 rounded-lg ${mood.color} p-2 text-center`}
                    style={{ marginTop: `${Number.parseInt(mood.time) * 8}px` }}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <div className="text-xs font-medium">{mood.mood}</div>
                    <div className="text-xs">{mood.time}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
