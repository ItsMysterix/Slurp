"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import Link from "next/link"
import {
  Phone,
  Heart,
  TreesIcon as Lungs,
  ThumbsUp,
  Eye,
  UserRound,
  ExternalLink,
  BookOpen,
  Sparkles,
  Clock,
  Headphones,
  MessageSquareHeart,
  Info,
} from "lucide-react"

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("emergency")

  // Function to handle emergency call button
  const handleEmergencyCall = () => {
    // TODO: Trigger call or redirect on emergency button
    window.location.href = "tel:988"

    // TODO: Optional: log help resource usage for pattern detection
    console.log("Emergency call button clicked:", new Date().toISOString())
  }

  // Function to log resource usage
  const logResourceUsage = (resourceName: string) => {
    // TODO: Optional: log help resource usage for pattern detection
    console.log(`Resource used: ${resourceName}`, new Date().toISOString())
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 p-4">
          <div className="container mx-auto">
            <div className="mb-8 rounded-2xl border-[4px] border-black bg-gradient-to-r from-yellow-200 to-orange-200 p-8 shadow-[8px_8px_0px_#000]">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl border-[3px] border-black bg-white p-3 shadow-[4px_4px_0px_#000]">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">Resources & Help 🆘</h1>
                  <p className="mt-2 text-lg font-semibold text-black/80">
                    Support tools and resources for when you need a little extra help
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="emergency" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 gap-3 rounded-xl border-[3px] border-black bg-white p-2 shadow-[6px_6px_0px_#000]">
                <TabsTrigger
                  value="emergency"
                  className="rounded-lg border-[2px] border-black font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-200 data-[state=active]:to-pink-200 data-[state=active]:shadow-[3px_3px_0px_#000]"
                >
                  Emergency 🚨
                </TabsTrigger>
                <TabsTrigger
                  value="coping"
                  className="rounded-lg border-[2px] border-black font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-200 data-[state=active]:to-emerald-200 data-[state=active]:shadow-[3px_3px_0px_#000]"
                >
                  Coping 🧘
                </TabsTrigger>
                <TabsTrigger
                  value="professional"
                  className="rounded-lg border-[2px] border-black font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-200 data-[state=active]:to-indigo-200 data-[state=active]:shadow-[3px_3px_0px_#000]"
                >
                  Professional 👩‍⚕️
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Emergency Section */}
            {activeTab === "emergency" && (
              <section className="mb-8">
                <div className="mb-6 rounded-xl border-[3px] border-black bg-gradient-to-r from-red-200 to-pink-200 p-4 shadow-[4px_4px_0px_#000]">
                  <h2 className="text-3xl font-black flex items-center gap-3">🚨 Emergency Support</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-[4px] border-black bg-gradient-to-br from-red-200 to-pink-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Phone className="h-5 w-5" />
                        Suicide & Crisis Lifeline
                      </CardTitle>
                      <CardDescription className="text-black/70">24/7 support for anyone in distress</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-4">
                        If you're experiencing a mental health crisis or having thoughts of suicide, trained crisis
                        counselors are available 24/7.
                      </p>
                      <Button
                        onClick={handleEmergencyCall}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold text-base px-4 py-3 min-h-[3rem] flex items-center justify-center break-words hyphens-auto"
                        size="lg"
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Phone className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="text-center leading-tight">Call 988</span>
                      </Button>
                    </CardContent>
                    <CardFooter className="border-t-2 border-black bg-white/20 p-3 text-sm">
                      You can also text HOME to 741741 to reach the Crisis Text Line
                    </CardFooter>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-orange-200 to-yellow-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Heart className="h-5 w-5" />
                        Domestic Violence Hotline
                      </CardTitle>
                      <CardDescription className="text-black/70">Support for those affected by abuse</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-4">
                        Confidential support for anyone experiencing domestic violence or seeking resources and
                        information.
                      </p>
                      <Button
                        onClick={() => {
                          window.location.href = "tel:18007997233"
                          logResourceUsage("Domestic Violence Hotline")
                        }}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold text-xs px-2 py-2 min-h-[3rem] flex items-center justify-center break-words hyphens-auto"
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Phone className="mr-1 h-4 w-4 flex-shrink-0" />
                        <span className="text-center leading-tight">Call 1-800-799-SAFE</span>
                      </Button>
                    </CardContent>
                    <CardFooter className="border-t-2 border-black bg-white/20 p-3 text-sm">
                      Available 24/7 in over 200 languages
                    </CardFooter>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-blue-200 to-indigo-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Info className="h-5 w-5" />
                        Local Emergency Services
                      </CardTitle>
                      <CardDescription className="text-black/70">Immediate emergency assistance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-4">
                        For immediate danger or medical emergencies, don't hesitate to contact local emergency services.
                      </p>
                      <Button
                        onClick={() => {
                          window.location.href = "tel:911"
                          logResourceUsage("Emergency Services")
                        }}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold text-lg break-words hyphens-auto"
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Phone className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="text-center leading-tight">Call 911</span>
                      </Button>
                    </CardContent>
                    <CardFooter className="border-t-2 border-black bg-white/20 p-3 text-sm">
                      For immediate life-threatening situations
                    </CardFooter>
                  </Card>
                </div>
              </section>
            )}

            {/* Quick Coping Tools Section */}
            {activeTab === "coping" && (
              <section className="mb-8">
                <div className="mb-6 rounded-xl border-[3px] border-black bg-gradient-to-r from-green-200 to-emerald-200 p-4 shadow-[4px_4px_0px_#000]">
                  <h2 className="text-3xl font-black flex items-center gap-3">🧘 Quick Coping Tools</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-[4px] border-black bg-gradient-to-br from-green-200 to-emerald-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Lungs className="h-5 w-5" />
                        Breathing Exercise
                      </CardTitle>
                      <CardDescription className="text-black/70">Calm your mind with deep breathing</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-4 rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                        <h3 className="mb-2 font-bold">4-7-8 Breathing Technique</h3>
                        <ol className="ml-5 list-decimal space-y-2 text-sm">
                          <li>Inhale quietly through your nose for 4 seconds</li>
                          <li>Hold your breath for 7 seconds</li>
                          <li>Exhale completely through your mouth for 8 seconds</li>
                          <li>Repeat 4 times</li>
                        </ol>
                      </div>
                      <Button
                        onClick={() => logResourceUsage("Breathing Exercise")}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold px-3 py-2 min-h-[2.5rem] flex items-center justify-center text-xs break-words hyphens-auto"
                        asChild
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Link href="/breathing-exercise">
                          <Sparkles className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="text-center leading-tight">Start Guided Exercise</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-yellow-200 to-orange-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <ThumbsUp className="h-5 w-5" />
                        Gratitude Practice
                      </CardTitle>
                      <CardDescription className="text-black/70">Focus on the positive in your life</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-4 rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                        <h3 className="mb-2 font-bold">3-Minute Gratitude Exercise</h3>
                        <ol className="ml-5 list-decimal space-y-2 text-sm">
                          <li>Write down 3 things you're grateful for today</li>
                          <li>For each item, write why it brings you joy</li>
                          <li>Take a moment to feel the gratitude</li>
                        </ol>
                      </div>
                      <Button
                        onClick={() => logResourceUsage("Gratitude Practice")}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold px-3 py-2 min-h-[2.5rem] flex items-center justify-center text-xs break-words hyphens-auto"
                        asChild
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Link href="/gratitude">
                          <BookOpen className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="text-center leading-tight">Gratitude Journal</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-purple-200 to-pink-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Eye className="h-5 w-5" />
                        5-Senses Exercise
                      </CardTitle>
                      <CardDescription className="text-black/70">Ground yourself in the present moment</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-4 rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                        <h3 className="mb-2 font-bold">The 5-4-3-2-1 Technique</h3>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <strong>5:</strong> Things you can see
                          </li>
                          <li>
                            <strong>4:</strong> Things you can touch
                          </li>
                          <li>
                            <strong>3:</strong> Things you can hear
                          </li>
                          <li>
                            <strong>2:</strong> Things you can smell
                          </li>
                          <li>
                            <strong>1:</strong> Thing you can taste
                          </li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => logResourceUsage("5-Senses Exercise")}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold px-3 py-2 min-h-[2.5rem] flex items-center justify-center text-xs break-words hyphens-auto"
                        asChild
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Link href="/grounding-exercise">
                          <Clock className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="text-center leading-tight">Start Timed Exercise</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-pink-200 to-red-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Headphones className="h-5 w-5" />
                        Guided Meditation
                      </CardTitle>
                      <CardDescription className="text-black/70">Short meditations for stress relief</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-4 rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                        <h3 className="mb-2 font-bold">Available Meditations</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• 2-minute Stress Relief</li>
                          <li>• 5-minute Body Scan</li>
                          <li>• 10-minute Mindfulness</li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => logResourceUsage("Guided Meditation")}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold px-3 py-2 min-h-[2.5rem] flex items-center justify-center text-xs break-words hyphens-auto"
                        asChild
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Link href="/meditations">
                          <Headphones className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="text-center leading-tight">Listen to Meditations</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-cyan-200 to-blue-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <MessageSquareHeart className="h-5 w-5" />
                        Talk to Slurpy
                      </CardTitle>
                      <CardDescription className="text-black/70">
                        Chat with your emotional support buddy
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-4 rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                        <h3 className="mb-2 font-bold">How Slurpy Can Help</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Listen to your feelings</li>
                          <li>• Provide gentle encouragement</li>
                          <li>• Suggest coping strategies</li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => logResourceUsage("Talk to Slurpy")}
                        className="w-full border-[3px] border-black bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-bold px-3 py-2 min-h-[2.5rem] flex items-center justify-center text-xs break-words hyphens-auto"
                        asChild
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        <Link href="/chat">
                          <MessageSquareHeart className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="text-center leading-tight">Chat with Slurpy</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            {/* Therapist Resources Section */}
            {activeTab === "professional" && (
              <section className="mb-8">
                <div className="mb-6 rounded-xl border-[3px] border-black bg-gradient-to-r from-blue-200 to-indigo-200 p-4 shadow-[4px_4px_0px_#000]">
                  <h2 className="text-3xl font-black flex items-center gap-3">👩‍⚕️ Professional Help Resources</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-[4px] border-black bg-gradient-to-br from-indigo-200 to-purple-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <UserRound className="h-5 w-5" />
                        Find a Therapist
                      </CardTitle>
                      <CardDescription className="text-black/70">
                        Online directories to find mental health professionals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Psychology Today</h3>
                          <p className="mb-2 text-sm">
                            Comprehensive directory of therapists, psychiatrists, and treatment centers.
                          </p>
                          <Button
                            onClick={() => logResourceUsage("Psychology Today")}
                            className="w-full border-[2px] border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold text-xs px-2 py-1 min-h-[2rem] break-words hyphens-auto"
                            asChild
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                          >
                            <Link
                              href="https://www.psychologytoday.com/us/therapists"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                              <span className="text-center leading-tight">Visit Website</span>
                            </Link>
                          </Button>
                        </div>

                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">BetterHelp</h3>
                          <p className="mb-2 text-sm">Online counseling platform with licensed therapists.</p>
                          <Button
                            onClick={() => logResourceUsage("BetterHelp")}
                            className="w-full border-[2px] border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold text-xs px-2 py-1 min-h-[2rem] break-words hyphens-auto"
                            asChild
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                          >
                            <Link href="https://www.betterhelp.com" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                              <span className="text-center leading-tight">Visit Website</span>
                            </Link>
                          </Button>
                        </div>

                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Talkspace</h3>
                          <p className="mb-2 text-sm">
                            Text, audio, and video-based therapy with licensed professionals.
                          </p>
                          <Button
                            onClick={() => logResourceUsage("Talkspace")}
                            className="w-full border-[2px] border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold text-xs px-2 py-1 min-h-[2rem] break-words hyphens-auto"
                            asChild
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                          >
                            <Link href="https://www.talkspace.com" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                              <span className="text-center leading-tight">Visit Website</span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-green-200 to-teal-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Heart className="h-5 w-5" />
                        Low-Cost Options
                      </CardTitle>
                      <CardDescription className="text-black/70">Affordable mental health resources</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Open Path Collective</h3>
                          <p className="mb-2 text-sm">Affordable therapy sessions between $30-60.</p>
                          <Button
                            onClick={() => logResourceUsage("Open Path Collective")}
                            className="w-full border-[2px] border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold text-xs px-2 py-1 min-h-[2rem] break-words hyphens-auto"
                            asChild
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                          >
                            <Link href="https://openpathcollective.org" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                              <span className="text-center leading-tight">Visit Website</span>
                            </Link>
                          </Button>
                        </div>

                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Community Mental Health Centers</h3>
                          <p className="mb-2 text-sm">Local centers offering sliding scale fees based on income.</p>
                          <Button
                            onClick={() => logResourceUsage("Community Mental Health Centers")}
                            className="w-full border-[2px] border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold text-xs px-2 py-1 min-h-[2rem] break-words hyphens-auto"
                            asChild
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                          >
                            <Link href="https://findtreatment.samhsa.gov" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-1 h-3 w-3 flex-shrink-0" />
                              <span className="text-center leading-tight text-xs">Find Centers</span>
                            </Link>
                          </Button>
                        </div>

                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">University Training Clinics</h3>
                          <p className="mb-2 text-sm">
                            Therapy provided by supervised graduate students at reduced rates.
                          </p>
                          <Badge className="border-[2px] border-black bg-yellow-200 text-black shadow-[1px_1px_0px_#000] font-bold">
                            Tip
                          </Badge>
                          <p className="mt-2 text-sm">Search for "psychology training clinic" + your city name</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[4px] border-black bg-gradient-to-br from-orange-200 to-red-200 shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <CardHeader className="border-b-[3px] border-black pb-4 bg-white/50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="h-5 w-5" />
                        Self-Help Resources
                      </CardTitle>
                      <CardDescription className="text-black/70">Books, apps, and online courses</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Recommended Books</h3>
                          <ul className="ml-5 list-disc space-y-1 text-sm">
                            <li>Feeling Good by David Burns</li>
                            <li>The Anxiety and Phobia Workbook by Edmund Bourne</li>
                            <li>The Mindful Way Through Depression by Mark Williams</li>
                          </ul>
                        </div>

                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Mental Health Apps</h3>
                          <ul className="ml-5 list-disc space-y-1 text-sm">
                            <li>Headspace (meditation)</li>
                            <li>Calm (sleep, meditation)</li>
                            <li>Woebot (CBT chatbot)</li>
                            <li>Moodfit (mood tracking)</li>
                          </ul>
                        </div>

                        <div className="rounded-lg border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
                          <h3 className="mb-1 font-bold">Online Courses</h3>
                          <p className="mb-2 text-sm">Free and low-cost mental health courses.</p>
                          <Button
                            onClick={() => logResourceUsage("Coursera Mental Health")}
                            className="w-full border-[2px] border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold text-xs px-2 py-1 min-h-[2rem] break-words hyphens-auto"
                            asChild
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                          >
                            <Link
                              href="https://www.coursera.org/courses?query=mental%20health"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                              <span className="text-center leading-tight">Browse Courses</span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            <div className="rounded-lg border-2 border-black bg-cream p-4 text-center">
              <p className="text-lg font-medium">Remember, you're not alone.</p>
              <p className="mt-2">
                These resources are here to support you, but if you're experiencing an emergency, please call 988 or
                your local emergency number immediately.
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
