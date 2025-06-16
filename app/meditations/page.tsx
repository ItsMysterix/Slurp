"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { ArrowLeft, Play, Pause, RefreshCw, Heart, Sparkles, Sun, Moon, Flower } from "lucide-react"
import Link from "next/link"
import { logExerciseUsage } from "@/lib/supabase"

const meditations = [
  {
    id: "stress-relief",
    title: "Stress Relief Meditation",
    duration: 120, // 2 minutes
    icon: Heart,
    color: "from-pink-200 to-rose-200",
    description: "A gentle practice to release tension and find inner peace",
    script: [
      "Find a comfortable seated position with your spine straight but not rigid.",
      "Close your eyes gently and take three deep breaths, letting each exhale be longer than the inhale.",
      "Bring your attention to your breath, noticing the natural rhythm without trying to change it.",
      "As you breathe in, imagine drawing in calm, peaceful energy.",
      "As you breathe out, release any tension, stress, or worry you're holding.",
      "If your mind wanders, gently guide your attention back to your breath with kindness.",
      "Continue this practice, letting each breath wash away stress like waves on the shore.",
      "Take a moment to appreciate this peaceful state you've created within yourself.",
    ],
  },
  {
    id: "body-scan",
    title: "Body Scan Meditation",
    duration: 300, // 5 minutes
    icon: Sparkles,
    color: "from-purple-200 to-indigo-200",
    description: "Progressive relaxation through mindful body awareness",
    script: [
      "Lie down comfortably or sit with your back supported.",
      "Close your eyes and take several deep, cleansing breaths.",
      "Begin by bringing attention to the top of your head. Notice any sensations without judgment.",
      "Slowly move your awareness down to your forehead, releasing any tension you find there.",
      "Continue to your eyes, jaw, and neck, consciously relaxing each area.",
      "Move down to your shoulders, letting them drop away from your ears.",
      "Scan your arms from shoulders to fingertips, releasing any tightness.",
      "Bring attention to your chest and heart center, breathing into this space.",
      "Move to your abdomen, noticing the gentle rise and fall with each breath.",
      "Scan your lower back, hips, and pelvis, releasing any stored tension.",
      "Continue down your thighs, knees, calves, and feet.",
      "Take a moment to feel your whole body relaxed and at peace.",
      "Wiggle your fingers and toes gently before slowly opening your eyes.",
    ],
  },
  {
    id: "morning-energy",
    title: "Morning Energy Flow",
    duration: 600, // 10 minutes
    icon: Sun,
    color: "from-yellow-200 to-orange-200",
    description: "Energizing practice to start your day with vitality",
    script: [
      "Sit tall with your spine erect, imagining a golden thread pulling you upward.",
      "Take three energizing breaths, inhaling vitality and exhaling any sleepiness.",
      "Visualize the warm morning sun rising within your heart center.",
      "Feel this golden light expanding with each breath, filling your entire body.",
      "Bring your palms together at your heart and set an intention for your day.",
      "Extend your arms overhead, reaching toward the sky like a tree growing toward light.",
      "Gently twist your spine left and right, awakening your core energy.",
      "Roll your shoulders back and open your chest, inviting in confidence and strength.",
      "Take several deep breaths, feeling energy flowing through every cell.",
      "Visualize yourself moving through your day with grace, strength, and joy.",
      "Place your hands on your heart and feel gratitude for this new day.",
      "Carry this energy and intention with you as you begin your day.",
    ],
  },
  {
    id: "evening-peace",
    title: "Evening Peace Meditation",
    duration: 480, // 8 minutes
    icon: Moon,
    color: "from-blue-200 to-purple-200",
    description: "Calming practice to release the day and prepare for rest",
    script: [
      "Find a comfortable position and allow your body to settle completely.",
      "Close your eyes and take three slow, deep breaths, releasing the day with each exhale.",
      "Bring to mind three things you're grateful for from today, however small.",
      "Feel appreciation filling your heart like warm, gentle light.",
      "Now, consciously release any worries or unfinished business from today.",
      "Imagine placing these concerns in a beautiful box, knowing you can return to them tomorrow if needed.",
      "Visualize the peaceful darkness of night surrounding you like a soft blanket.",
      "Feel your body becoming heavier and more relaxed with each breath.",
      "Let go of any need to be anywhere else or do anything else right now.",
      "Simply rest in this moment of complete peace and stillness.",
      "If thoughts arise, acknowledge them gently and let them float away like clouds.",
      "Rest in the quiet space between thoughts, the natural peace that is always within you.",
      "When you're ready, slowly return to the room, carrying this peace with you into sleep.",
    ],
  },
  {
    id: "loving-kindness",
    title: "Loving-Kindness Meditation",
    duration: 420, // 7 minutes
    icon: Flower,
    color: "from-green-200 to-emerald-200",
    description: "Cultivate compassion and love for yourself and others",
    script: [
      "Sit comfortably with your heart open and your hands resting gently on your knees.",
      "Close your eyes and take several deep breaths, settling into this moment.",
      "Begin by bringing yourself to mind with kindness and compassion.",
      "Silently repeat: 'May I be happy. May I be healthy. May I be at peace. May I be free from suffering.'",
      "Feel these wishes for yourself with genuine warmth and care.",
      "Now bring to mind someone you love dearly - a family member, friend, or pet.",
      "Send them the same loving wishes: 'May you be happy. May you be healthy. May you be at peace.'",
      "Expand your circle to include a neutral person - someone you neither love nor dislike.",
      "Offer them the same heartfelt wishes for wellbeing and happiness.",
      "Now, if you feel ready, bring to mind someone with whom you have difficulty.",
      "Try to send them loving wishes, knowing that all beings deserve happiness and peace.",
      "Finally, expand your loving-kindness to all beings everywhere.",
      "Feel your heart opening like a flower, radiating love and compassion in all directions.",
      "Rest in this feeling of universal love and connection.",
    ],
  },
]

export default function MeditationsPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<(typeof meditations)[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [exerciseStartTime, setExerciseStartTime] = useState<Date | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isPlaying && selectedMeditation && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Move to next step
            if (currentStep < selectedMeditation.script.length - 1) {
              setCurrentStep(currentStep + 1)
              return Math.floor(selectedMeditation.duration / selectedMeditation.script.length)
            } else {
              // Meditation completed
              completeMeditation()
              return 0
            }
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, timeLeft, currentStep, selectedMeditation])

  const startMeditation = (meditation: (typeof meditations)[0]) => {
    setSelectedMeditation(meditation)
    setCurrentStep(0)
    setTimeLeft(Math.floor(meditation.duration / meditation.script.length))
    setIsPlaying(true)
    setExerciseStartTime(new Date())
  }

  const pauseMeditation = () => {
    setIsPlaying(false)
  }

  const resumeMeditation = () => {
    setIsPlaying(true)
  }

  const resetMeditation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    if (selectedMeditation) {
      setTimeLeft(Math.floor(selectedMeditation.duration / selectedMeditation.script.length))
    }
    setExerciseStartTime(null)
  }

  const completeMeditation = async () => {
    setIsPlaying(false)
    if (selectedMeditation && exerciseStartTime) {
      const duration = Math.floor((new Date().getTime() - exerciseStartTime.getTime()) / 1000)
      await logExerciseUsage("meditation", selectedMeditation.title, duration, true)
    }
  }

  const backToList = () => {
    setSelectedMeditation(null)
    setIsPlaying(false)
    setCurrentStep(0)
    setTimeLeft(0)
    setExerciseStartTime(null)
  }

  if (selectedMeditation) {
    const Icon = selectedMeditation.icon
    const isCompleted = currentStep >= selectedMeditation.script.length - 1 && timeLeft === 0

    return (
      <ProtectedRoute>
        <AppShell>
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={backToList}
                className="h-10 w-10 rounded-lg border-2 border-black bg-white text-black shadow-neubrutal-sm transition-all hover:shadow-neubrutal-hover active:shadow-neubrutal-active"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-extrabold tracking-tight">{selectedMeditation.title}</h1>
            </div>

            <Card className={`neubrutal border-2 border-black bg-gradient-to-br ${selectedMeditation.color}`}>
              <CardHeader className="border-b-2 border-black pb-3">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Icon className="h-6 w-6" />
                  {selectedMeditation.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isCompleted ? (
                  // Completion screen
                  <div className="text-center">
                    <div className="mb-8 p-6 rounded-lg border-2 border-black bg-white/50 shadow-neubrutal-sm">
                      <h2 className="text-3xl font-bold mb-4">🧘‍♀️ Meditation Complete</h2>
                      <p className="text-lg mb-6">
                        Take a moment to notice how you feel. Carry this sense of peace with you.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={resetMeditation}
                        className="neubrutal-sm bg-black text-white hover:bg-black/80 px-6 py-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Practice Again
                      </Button>
                      <Button
                        onClick={backToList}
                        className="neubrutal-sm bg-white text-black hover:bg-gray-100 px-6 py-2"
                      >
                        Choose Another
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Meditation in progress
                  <div className="text-center">
                    <div className="mb-8 p-6 rounded-lg border-2 border-black bg-white/50 shadow-neubrutal-sm">
                      <Icon className="h-16 w-16 mx-auto mb-4" />
                      <div className="text-4xl font-bold mb-4">{timeLeft}s</div>
                      <div className="text-sm text-gray-600 mb-4">
                        Step {currentStep + 1} of {selectedMeditation.script.length}
                      </div>
                      <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                        {selectedMeditation.script[currentStep]}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={isPlaying ? pauseMeditation : resumeMeditation}
                        className="neubrutal-sm bg-black text-white hover:bg-black/80 px-6 py-2"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" /> Resume
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetMeditation}
                        className="neubrutal-sm bg-white text-black hover:bg-gray-100 px-6 py-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Restart
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-10 w-10 rounded-lg border-2 border-black bg-white text-black shadow-neubrutal-sm transition-all hover:shadow-neubrutal-hover active:shadow-neubrutal-active"
            >
              <Link href="/help">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-extrabold tracking-tight">Guided Meditations</h1>
          </div>

          <div className="mb-8 rounded-2xl border-[4px] border-black bg-gradient-to-r from-purple-200 to-pink-200 p-6 shadow-[8px_8px_0px_#000]">
            <h2 className="text-2xl font-bold mb-2">🧘‍♀️ Yoga-Inspired Meditations</h2>
            <p className="text-lg">
              These guided meditations draw from ancient yoga wisdom to help you find peace, balance, and inner
              strength.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditations.map((meditation) => {
              const Icon = meditation.icon
              return (
                <Card
                  key={meditation.id}
                  className={`neubrutal border-2 border-black bg-gradient-to-br ${meditation.color} shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer`}
                  onClick={() => startMeditation(meditation)}
                >
                  <CardHeader className="border-b-2 border-black pb-3 bg-white/30">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Icon className="h-6 w-6" />
                      {meditation.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm mb-4">{meditation.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {Math.floor(meditation.duration / 60)} min {meditation.duration % 60}s
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          startMeditation(meditation)
                        }}
                        className="neubrutal-sm bg-black text-white hover:bg-black/80 px-4 py-2"
                        size="sm"
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
