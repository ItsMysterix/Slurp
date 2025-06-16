"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { ArrowLeft, Pause, Play, RefreshCw, Eye, Hand, Ear, SnailIcon as Nose, Zap } from "lucide-react"
import Link from "next/link"
import { logExerciseUsage } from "@/lib/supabase"

const steps = [
  {
    number: 5,
    sense: "See",
    icon: Eye,
    instruction: "Name 5 things you can see around you",
    color: "from-red-200 to-pink-200",
    examples: ["A lamp", "Your phone", "A book", "The ceiling", "Your hands"],
  },
  {
    number: 4,
    sense: "Touch",
    icon: Hand,
    instruction: "Name 4 things you can touch or feel",
    color: "from-orange-200 to-yellow-200",
    examples: ["The chair you're sitting on", "Your clothes", "The temperature", "Your hair"],
  },
  {
    number: 3,
    sense: "Hear",
    icon: Ear,
    instruction: "Name 3 things you can hear",
    color: "from-green-200 to-emerald-200",
    examples: ["Traffic outside", "Your breathing", "A clock ticking", "Background music"],
  },
  {
    number: 2,
    sense: "Smell",
    icon: Nose,
    instruction: "Name 2 things you can smell",
    color: "from-blue-200 to-indigo-200",
    examples: ["Coffee", "Fresh air", "Soap", "Food cooking"],
  },
  {
    number: 1,
    sense: "Taste",
    icon: Zap,
    instruction: "Name 1 thing you can taste",
    color: "from-purple-200 to-pink-200",
    examples: ["Mint from gum", "Coffee", "Water", "The taste in your mouth"],
  },
]

export default function GroundingExercisePage() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per step
  const [userInputs, setUserInputs] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [exerciseStartTime, setExerciseStartTime] = useState<Date | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Auto-advance to next step
      nextStep()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, timeLeft])

  const startExercise = () => {
    setIsActive(true)
    setExerciseStartTime(new Date())
    setCurrentStep(0)
    setTimeLeft(60)
    setUserInputs([])
    setCurrentInput("")
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimeLeft(60)
      setCurrentInput("")
    } else {
      // Exercise completed
      completeExercise()
    }
  }

  const completeExercise = async () => {
    setIsActive(false)
    if (exerciseStartTime) {
      const duration = Math.floor((new Date().getTime() - exerciseStartTime.getTime()) / 1000)
      await logExerciseUsage("grounding", "5-4-3-2-1 Grounding", duration, true)
    }
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentStep(0)
    setTimeLeft(60)
    setUserInputs([])
    setCurrentInput("")
    setExerciseStartTime(null)
  }

  const addInput = () => {
    if (currentInput.trim()) {
      const newInputs = [...userInputs]
      newInputs[currentStep] = currentInput.trim()
      setUserInputs(newInputs)
      setCurrentInput("")
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData?.icon || Eye

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
            <h1 className="text-3xl font-extrabold tracking-tight">5-4-3-2-1 Grounding Exercise</h1>
          </div>

          <Card className="neubrutal border-2 border-black bg-gradient-to-br from-mint to-lavender">
            <CardHeader className="border-b-2 border-black pb-3">
              <CardTitle className="text-xl">Guided Grounding Technique</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!isActive && currentStep === 0 ? (
                // Start screen
                <div className="text-center">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Ready to Ground Yourself?</h2>
                    <p className="text-lg mb-6">
                      This exercise helps you reconnect with the present moment using your five senses.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 border-black bg-gradient-to-br ${step.color} shadow-neubrutal-sm`}
                        >
                          <step.icon className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{step.number}</div>
                          <div className="text-sm font-medium">{step.sense}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={startExercise}
                    className="neubrutal-sm bg-black text-white hover:bg-black/80 text-lg px-8 py-3"
                    size="lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Exercise
                  </Button>
                </div>
              ) : currentStep < steps.length ? (
                // Exercise in progress
                <div className="text-center">
                  <div
                    className={`mb-8 p-6 rounded-lg border-2 border-black bg-gradient-to-br ${currentStepData.color} shadow-neubrutal-sm`}
                  >
                    <Icon className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">{currentStepData.number}</h2>
                    <h3 className="text-xl font-semibold mb-4">{currentStepData.instruction}</h3>
                    <div className="text-6xl font-bold mb-4">{timeLeft}s</div>

                    <div className="mb-4">
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addInput()}
                        placeholder={`What can you ${currentStepData.sense.toLowerCase()}?`}
                        className="w-full p-3 border-2 border-black rounded-lg text-center text-lg"
                        disabled={!isActive}
                      />
                      <Button
                        onClick={addInput}
                        className="mt-2 neubrutal-sm bg-white text-black hover:bg-gray-100"
                        disabled={!currentInput.trim() || !isActive}
                      >
                        Add
                      </Button>
                    </div>

                    {userInputs[currentStep] && (
                      <div className="mb-4 p-3 bg-white border-2 border-black rounded-lg">
                        <strong>You noticed:</strong> {userInputs[currentStep]}
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      <strong>Examples:</strong> {currentStepData.examples.join(", ")}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={isActive ? pauseExercise : () => setIsActive(true)}
                      className="neubrutal-sm bg-black text-white hover:bg-black/80 px-6 py-2"
                    >
                      {isActive ? (
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
                      onClick={nextStep}
                      className="neubrutal-sm bg-coral text-black hover:bg-coral/80 px-6 py-2"
                      disabled={!userInputs[currentStep]}
                    >
                      Next Step
                    </Button>
                    <Button
                      onClick={resetExercise}
                      className="neubrutal-sm bg-white text-black hover:bg-gray-100 px-6 py-2"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                  </div>
                </div>
              ) : (
                // Completion screen
                <div className="text-center">
                  <div className="mb-8 p-6 rounded-lg border-2 border-black bg-gradient-to-br from-green-200 to-emerald-200 shadow-neubrutal-sm">
                    <h2 className="text-3xl font-bold mb-4">🎉 Well Done!</h2>
                    <p className="text-lg mb-6">
                      You've completed the 5-4-3-2-1 grounding exercise. Take a moment to notice how you feel now.
                    </p>

                    <div className="text-left max-w-md mx-auto mb-6">
                      <h3 className="font-bold mb-3">What you noticed:</h3>
                      {userInputs.map(
                        (input, index) =>
                          input && (
                            <div key={index} className="mb-2 p-2 bg-white border border-black rounded">
                              <strong>
                                {steps[index].number} {steps[index].sense}:
                              </strong>{" "}
                              {input}
                            </div>
                          ),
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={resetExercise}
                      className="neubrutal-sm bg-black text-white hover:bg-black/80 px-6 py-2"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Do Again
                    </Button>
                    <Button asChild className="neubrutal-sm bg-coral text-black hover:bg-coral/80 px-6 py-2">
                      <Link href="/help">Back to Resources</Link>
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
