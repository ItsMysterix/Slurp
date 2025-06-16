"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Clock, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ReminderCard() {
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [reminderMode, setReminderMode] = useState("gentle")

  return (
    <Card className="neubrutal bg-lavender">
      <CardHeader className="border-b-2 border-black pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-5 w-5" />
            Slurpy's Nudges
          </CardTitle>
          <Switch
            checked={remindersEnabled}
            onCheckedChange={setRemindersEnabled}
            className="data-[state=checked]:bg-black"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {remindersEnabled ? (
          <>
            <p className="mb-4 text-sm">Choose how Slurpy reminds you to track your mood:</p>
            <RadioGroup value={reminderMode} onValueChange={setReminderMode} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gentle" id="gentle" className="border-black text-black" />
                <Label
                  htmlFor="gentle"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-black bg-white/50 p-2 text-sm"
                >
                  <Clock className="h-4 w-4" />
                  Gentle (once/day, morning)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sass" id="sass" className="border-black text-black" />
                <Label
                  htmlFor="sass"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-black bg-white/50 p-2 text-sm"
                >
                  <Zap className="h-4 w-4" />
                  Sass Mode ("You haven't slurped in 48 hours 😤")
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="smart" id="smart" className="border-black text-black" />
                <Label
                  htmlFor="smart"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-black bg-white/50 p-2 text-sm"
                >
                  <Bell className="h-4 w-4" />
                  Smart Mode (learns from your entry times)
                </Label>
              </div>
            </RadioGroup>
            <div className="mt-4 rounded-lg border-2 border-black bg-white/50 p-3 text-sm">
              <p className="font-medium">Next reminder:</p>
              <p>Tomorrow at 9:00 AM</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <BellOff className="mb-2 h-10 w-10" />
            <p className="text-lg font-medium">Reminders are disabled</p>
            <p className="mb-4 text-sm text-muted-foreground">You won't receive any notifications to track your mood</p>
            <Button onClick={() => setRemindersEnabled(true)} className="neubrutal-sm bg-black text-white">
              Enable Reminders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
