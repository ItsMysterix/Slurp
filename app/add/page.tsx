"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getCurrentUser, addMoodEntry } from "@/lib/supabase"
import { fruityMoods, type FruityMood } from "@/lib/mood-utils"
import { MoodIcon } from "@/components/mood-icon"

export default function AddSlurpPage() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<FruityMood | null>(null)
  const [note, setNote] = useState("")
  const [location, setLocation] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("🔍 Checking authentication...")
      const currentUser = await getCurrentUser()
      console.log("🔍 Current user:", currentUser)

      if (currentUser) {
        setUser(currentUser)
        console.log("✅ User authenticated:", currentUser.email)
      } else {
        console.log("❌ No user found, redirecting to login")
        router.push("/login")
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoodSelect = (mood: FruityMood) => {
    setSelectedMood(mood)
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert("Please select your mood flavor!")
      return
    }

    if (!user) {
      alert("Please sign in to save your mood!")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("💾 Saving mood to database...")

      const moodData = {
        mood_name: selectedMood.name,
        emoji: selectedMood.iconPath, // Store icon path instead of emoji
        emotion: selectedMood.emotion,
        note: note || null,
        bg_color: selectedMood.bgColor,
        location: location || null,
        is_private: isPrivate,
      }

      console.log("💾 Mood data:", moodData)

      const result = await addMoodEntry(moodData)

      if (result.success) {
        console.log("✅ Mood saved successfully:", result.data)
        alert(`${selectedMood.name} mood logged successfully! 🎉`)

        // Reset form
        setSelectedMood(null)
        setNote("")
        setLocation("")
        setIsPrivate(false)

        // Navigate back to dashboard
        router.push("/dashboard")
      } else {
        console.error("❌ Error saving mood:", result.error)
        alert("Oops! Couldn't save your mood. Please try again.")
      }
    } catch (error) {
      console.error("❌ Error saving mood:", error)
      alert("Oops! Couldn't save your mood. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100">
        <div className="text-center border-2 border-black bg-yellow-100 p-8 rounded-lg shadow-[6px_6px_0px_#000]">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto"></div>
          <p className="text-black font-bold text-lg">🔍 Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100">
        <div className="text-center border-2 border-black bg-red-100 p-8 rounded-lg shadow-[6px_6px_0px_#000]">
          <p className="text-black font-bold text-lg">🔐 Please log in to continue</p>
          <Button
            onClick={() => router.push("/login")}
            className="mt-4 border-2 border-black bg-white px-6 py-2 font-bold text-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000]"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-pink-100 font-sans">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100"></div>

      {/* Simple nav */}
      <nav className="relative z-10 border-b-2 border-black bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/slurp-app-icon.ico" alt="Slurp." className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-black">Slurp.</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-black hover:underline font-medium">
              Dashboard
            </Link>
            <div className="flex items-center gap-2 border-2 border-black bg-yellow-100 px-3 py-1 rounded-full shadow-[2px_2px_0px_#000]">
              <span className="text-sm">👤</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_#000]">
          <CardHeader className="border-b-2 border-black p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold tracking-tight text-black">
                How's your flavor today? 🍓
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]"
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-6 w-6 text-black" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">
            <div>
              <Label className="mb-3 block text-lg font-semibold text-black">Pick your flavor:</Label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {fruityMoods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood)}
                    className={`
                      flex h-auto w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-black p-4 text-sm font-semibold
                      shadow-[2px_2px_0px_#000] transition-all hover:shadow-[4px_4px_0px_#000] active:shadow-[1px_1px_0px_#000]
                      ${mood.bgColor}
                      ${selectedMood?.id === mood.id ? "ring-4 ring-black ring-offset-2" : ""}
                    `}
                  >
                    {MoodIcon ? (
                      <MoodIcon mood={mood} size={48} />
                    ) : (
                      <img
                        src={mood.iconPath || "/placeholder.svg"}
                        alt={mood.name}
                        width={48}
                        height={48}
                        className="inline-block"
                      />
                    )}
                    <div className="mt-1 flex flex-col items-center">
                      <span className="text-center text-black text-xs font-bold leading-tight">{mood.name}</span>
                      <span className="text-center text-gray-500 text-[10px] leading-tight">{mood.emotion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="note" className="text-lg font-semibold text-black">
                Tell us why (optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's making your day this flavor?"
                className="min-h-[120px] w-full rounded-md border-2 border-black bg-white p-4 text-base text-black shadow-[3px_3px_0px_#000] focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-lg font-semibold text-black">
                Where are you? (optional)
              </Label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Home, Work, Coffee Shop, etc."
                className="w-full rounded-md border-2 border-black bg-white p-4 text-base text-black shadow-[3px_3px_0px_#000] focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 rounded border-2 border-black"
              />
              <Label htmlFor="private" className="text-sm font-medium text-black">
                Make this entry private (only visible to you)
              </Label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className="w-full rounded-lg border-2 border-black bg-red-400 px-6 py-4 text-lg font-bold text-black shadow-[4px_4px_0px_#000] transition-all hover:bg-red-500 hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] disabled:opacity-70 disabled:shadow-none"
            >
              {isSubmitting ? "Saving to Database... 💾" : "Save My Slurp. 🎉"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
