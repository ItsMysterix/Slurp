"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { toast } from "sonner"
import {
  getUserProfile,
  updateUserProfile,
  getMoodStats,
  deleteAllMoodData,
  isAuthenticated,
  type UserProfile,
  type MoodStats,
} from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [anonymousMode, setAnonymousMode] = useState(false)
  const [moodStats, setMoodStats] = useState<MoodStats>({
    totalEntries: 0,
    mostUsedMood: null,
    firstLogDate: null,
    streakData: [],
    moodDistribution: [],
  })

  // Update the fruitPersonas array to use ico files and add more options
  const fruitPersonas = [
    { value: "strawberry-bliss", label: "Strawberry Bliss", iconPath: "/mood-icons/strawberry-bliss.ico" },
    { value: "sour-lemon", label: "Sour Lemon", iconPath: "/mood-icons/sour-lemon.ico" },
    { value: "pineapple-punch", label: "Pineapple Punch", iconPath: "/mood-icons/pineapple-punch.ico" },
    { value: "slippery-banana", label: "Slippery Banana", iconPath: "/mood-icons/slippery-banana.ico" },
    { value: "spiky-papaya", label: "Spiky Papaya", iconPath: "/mood-icons/spiky-papaya.ico" },
    { value: "watermelon-wave", label: "Watermelon Wave", iconPath: "/mood-icons/watermelon-wave.ico" },
    { value: "blueberry-burnout", label: "Blueberry Burnout", iconPath: "/mood-icons/blueberry-burnout.ico" },
    { value: "grape-expectations", label: "Grape Expectations", iconPath: "/mood-icons/grape-expectations.ico" },
    { value: "peachy-keen", label: "Peachy Keen", iconPath: "/mood-icons/peachy-keen.ico" },
    { value: "mango-mania", label: "Mango Mania", iconPath: "/mood-icons/mango-mania.ico" },
    { value: "apple-clarity", label: "Apple Clarity", iconPath: "/mood-icons/apple-clarity.ico" },
    { value: "cherry-charge", label: "Cherry Charge", iconPath: "/mood-icons/cherry-charge.ico" },
    { value: "fiery-guava", label: "Fiery Guava", iconPath: "/mood-icons/fiery-guava.ico" },
    { value: "peer-pressure", label: "Peer Pressure", iconPath: "/mood-icons/peer-pressure.ico" },
    { value: "musk-melt", label: "Musk Melt", iconPath: "/mood-icons/musk-melt.ico" },
    { value: "kiwi-comeback", label: "Kiwi Comeback", iconPath: "/mood-icons/kiwi-comeback.ico" },
  ]

  // Update the default fruitPersona state
  const [fruitPersona, setFruitPersona] = useState("strawberry-bliss")

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }

        const [userProfile, stats] = await Promise.all([getUserProfile(), getMoodStats()])

        // Update the profile loading to use ico file IDs
        if (userProfile) {
          setProfile(userProfile)
          setUsername(userProfile.username || "")
          setFullName(userProfile.name || "")
          setFruitPersona(userProfile.profile_icon || "strawberry-bliss")
          setAnonymousMode(userProfile.anonymous_mode)
        }

        setMoodStats(stats)
      } catch (error) {
        console.error("Error loading user data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const success = await updateUserProfile({
        username: username || null,
        name: fullName || null,
        profile_icon: fruitPersona,
        anonymous_mode: anonymousMode,
      })

      if (success) {
        toast.success("Profile updated successfully! 🍓")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleExportMoodLogs = async () => {
    try {
      const exportData = {
        user: profile?.username || "Anonymous",
        exportDate: new Date().toISOString(),
        stats: moodStats,
        note: "Exported from Slurp - Fruity Mood Tracker",
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `slurp-mood-logs-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Mood logs exported! 📊")
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Failed to export mood logs")
    }
  }

  const handleDeleteAllMoodData = async () => {
    if (!confirm("Are you sure you want to delete all your mood data? This action cannot be undone.")) {
      return
    }

    try {
      const success = await deleteAllMoodData()
      if (success) {
        toast.success("All mood data deleted")
        const newStats = await getMoodStats()
        setMoodStats(newStats)
      } else {
        toast.error("Failed to delete mood data")
      }
    } catch (error) {
      console.error("Error deleting mood data:", error)
      toast.error("Failed to delete mood data")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍓</div>
          <p className="text-lg font-bold">Loading your fruity profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="mr-4 h-12 w-12 rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-black text-black">Your Profile</h1>
            <p className="text-lg text-gray-600">Manage your fruity identity 🍎</p>
          </div>
        </div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-pink-100">
              <CardHeader className="border-b-[3px] border-black bg-pink-200 rounded-t-2xl">
                <CardTitle className="text-2xl font-black flex items-center gap-3">🪪 USER IDENTITY</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Update the profile icon display to use ico files */}
                    <div className="w-32 h-32 rounded-full border-[4px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={
                          fruitPersonas.find((p) => p.value === fruitPersona)?.iconPath ||
                          "/mood-icons/strawberry-bliss.ico"
                        }
                        alt="Profile Icon"
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-lg font-bold">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="border-[3px] border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg p-4"
                          placeholder="Enter username"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-lg font-bold">
                          Full Name
                        </Label>
                        <Input
                          id="fullname"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="border-[3px] border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg p-4"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-lg font-bold">Fruit Persona</Label>
                      <Select value={fruitPersona} onValueChange={setFruitPersona}>
                        <SelectTrigger className="border-[3px] border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg p-4">
                          <SelectValue />
                        </SelectTrigger>
                        {/* Update the Select options to show icons */}
                        <SelectContent className="border-[3px] border-black rounded-lg">
                          {fruitPersonas.map((persona) => (
                            <SelectItem key={persona.value} value={persona.value} className="text-lg">
                              <div className="flex items-center gap-2">
                                <img
                                  src={persona.iconPath || "/placeholder.svg"}
                                  alt={persona.label}
                                  width={20}
                                  height={20}
                                  className="rounded-full"
                                />
                                {persona.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border-[3px] border-black bg-orange-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div>
                        <Label htmlFor="anonymous-mode" className="text-lg font-bold">
                          🥸 Anonymous Mode
                        </Label>
                        <p className="text-sm text-gray-600">Hide your identity in leaderboards</p>
                      </div>
                      <Switch
                        id="anonymous-mode"
                        checked={anonymousMode}
                        onCheckedChange={setAnonymousMode}
                        className="data-[state=checked]:bg-black"
                      />
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full bg-green-400 hover:bg-green-500 text-black font-black text-lg py-4 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-red-100">
              <CardHeader className="border-b-[3px] border-black bg-red-200 rounded-t-2xl">
                <CardTitle className="text-2xl font-black flex items-center gap-3">🔐 PRIVACY & DATA</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleExportMoodLogs}
                      className="bg-blue-400 hover:bg-blue-500 text-black font-black text-lg py-4 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Export Mood Logs
                    </Button>

                    <Button
                      onClick={handleDeleteAllMoodData}
                      variant="outline"
                      className="bg-white hover:bg-red-50 text-red-600 font-black text-lg py-4 border-[3px] border-red-500 rounded-xl shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      Delete All Data
                    </Button>
                  </div>

                  <div className="p-6 rounded-xl border-[3px] border-black bg-yellow-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-black mb-2">🛡️ Data Privacy Statement</h3>
                    <p className="text-sm text-gray-700">
                      Slurp takes your privacy seriously. We only collect the data necessary to provide you with the
                      best mood tracking experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
