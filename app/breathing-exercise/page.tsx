"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { ArrowLeft, Pause, Play, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function BreathingExercisePage() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale")
  const [timeLeft, setTimeLeft] = useState(4)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Move to next phase when time is up
            switch (currentPhase) {
              case "inhale":
                setCurrentPhase("hold")
                return 7 // Hold breath for 7 seconds
              case "hold":
                setCurrentPhase("exhale")
                return 8 // Exhale for 8 seconds
              case "exhale":
                if (cyclesCompleted < 3) {
                  setCurrentPhase("inhale")
                  setCyclesCompleted(cyclesCompleted + 1)
                  return 4 // Inhale for 4 seconds
                } else {
                  setCurrentPhase("rest")
                  return 5 // Rest for 5 seconds before stopping
                }
              case "rest":
                setIsActive(false)
                setCyclesCompleted(0)
                setCurrentPhase("inhale")
                return 4 // Reset to initial state
              default:
                return prevTime
            }
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, currentPhase, cyclesCompleted])

  const toggleExercise = () => {
    if (!isActive) {
      // Reset to initial state when starting
      setCurrentPhase("inhale")
      setTimeLeft(4)
      setCyclesCompleted(0)
    }
    setIsActive(!isActive)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentPhase("inhale")
    setTimeLeft(4)
    setCyclesCompleted(0)
  }

  const getInstructions = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe in slowly through your nose..."
      case "hold":
        return "Hold your breath..."
      case "exhale":
        return "Exhale slowly through your mouth..."
      case "rest":
        return "Well done! Take a moment to notice how you feel..."
      default:
        return "Get ready to begin..."
    }
  }

  const getCircleSize = () => {
    switch (currentPhase) {
      case "inhale":
        return "scale-100"
      case "hold":
        return "scale-100"
      case "exhale":
        return "scale-50"
      case "rest":
        return "scale-75"
      default:
        return "scale-75"
    }
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
            <h1 className="text-3xl font-extrabold tracking-tight">4-7-8 Breathing Exercise</h1>
          </div>

          <Card className="neubrutal border-2 border-black bg-mint">
            <CardHeader className="border-b-2 border-black pb-3">
              <CardTitle className="text-xl">Guided Breathing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6">
              <div className="mb-8 flex flex-col items-center justify-center">
                <div
                  className={`relative mb-8 flex h-48 w-48 items-center justify-center rounded-full border-4 border-black bg-white transition-all duration-1000 ${getCircleSize()}`}
                >
                  <span className="text-4xl font-bold">{timeLeft}</span>
                  <div className="absolute inset-0 rounded-full border-4 border-black border-opacity-20"></div>
                </div>
                <h2 className="text-2xl font-bold">{getInstructions()}</h2>
                <p className="mt-2 text-center text-muted-foreground">
                  {isActive ? `Cycle ${cyclesCompleted + 1} of 4` : "Complete 4 cycles for best results"}
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <Button
                  onClick={toggleExercise}
                  className="flex-1 neubrutal-sm bg-black text-white hover:bg-black/80"
                  size="lg"
                >
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" /> Start
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetExercise}
                  className="flex-1 neubrutal-sm bg-white text-black hover:bg-gray-100"
                  size="lg"
                  disabled={!isActive && cyclesCompleted === 0}
                >
                  <RefreshCw className="mr-2 h-5 w-5" /> Reset
                </Button>
              </div>

              <div className="mt-8 rounded-lg border-2 border-black bg-white p-4">
                <h3 className="mb-2 font-semibold">How it works:</h3>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Inhale quietly through your nose for 4 seconds</li>
                  <li>Hold your breath for 7 seconds</li>
                  <li>Exhale completely through your mouth for 8 seconds</li>
                  <li>Repeat for 4 cycles</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  This exercise is a natural tranquilizer for the nervous system, helping to reduce anxiety and promote
                  better sleep.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
