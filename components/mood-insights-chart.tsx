"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// TODO: Fetch this data from Supabase
const moodData = [
  { day: "Mon", happy: 4, calm: 3, stressed: 2, sad: 1, angry: 0 },
  { day: "Tue", happy: 3, calm: 4, stressed: 1, sad: 2, angry: 0 },
  { day: "Wed", happy: 2, calm: 3, stressed: 4, sad: 1, angry: 0 },
  { day: "Thu", happy: 1, calm: 2, stressed: 3, sad: 4, angry: 0 },
  { day: "Fri", happy: 3, calm: 4, stressed: 2, sad: 1, angry: 0 },
  { day: "Sat", happy: 4, calm: 3, stressed: 1, sad: 2, angry: 0 },
  { day: "Sun", happy: 5, calm: 4, stressed: 0, sad: 1, angry: 0 },
]

export function MoodInsightsChart() {
  return (
    <Card className="neubrutal bg-white">
      <CardHeader className="border-b-2 border-black pb-3">
        <CardTitle className="text-lg font-bold">Weekly Mood Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={{
            happy: {
              label: "Happy",
              color: "hsl(var(--chart-1))",
            },
            calm: {
              label: "Calm",
              color: "hsl(var(--chart-2))",
            },
            stressed: {
              label: "Stressed",
              color: "hsl(var(--chart-3))",
            },
            sad: {
              label: "Sad",
              color: "hsl(var(--chart-4))",
            },
            angry: {
              label: "Angry",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="happy" stroke="var(--color-happy)" strokeWidth={2} />
              <Line type="monotone" dataKey="calm" stroke="var(--color-calm)" strokeWidth={2} />
              <Line type="monotone" dataKey="stressed" stroke="var(--color-stressed)" strokeWidth={2} />
              <Line type="monotone" dataKey="sad" stroke="var(--color-sad)" strokeWidth={2} />
              <Line type="monotone" dataKey="angry" stroke="var(--color-angry)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
