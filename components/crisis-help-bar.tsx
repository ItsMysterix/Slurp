"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Phone, ExternalLink, Sparkles } from "lucide-react"
import Link from "next/link"

interface CrisisHelpBarProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onToggle: () => void
}

export function CrisisHelpBar({ isOpen, onOpenChange, onToggle }: CrisisHelpBarProps) {
  const [breathingExercise, setBreathingExercise] = useState(false)
  const [breathStep, setBreathStep] = useState(0)

  const startBreathingExercise = () => {
    setBreathingExercise(true)
    setBreathStep(0)
    setTimeout(() => setBreathStep(1), 0)
    setTimeout(() => setBreathStep(2), 4000)
    setTimeout(() => setBreathStep(3), 8000)
    setTimeout(() => setBreathStep(4), 12000)
    setTimeout(() => {
      setBreathingExercise(false)
      setBreathStep(0)
    }, 16000)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black bg-cream p-2">
        <div className="container mx-auto flex items-center justify-between">
          <Button onClick={onToggle} className="neubrutal-sm bg-coral text-black">
            <Heart className="mr-2 h-4 w-4" />
            Feeling Overwhelmed?
          </Button>
          <div className="hidden items-center gap-2 text-xs sm:flex">
            <span>Need immediate help?</span>
            <Button asChild size="sm" variant="link" className="h-auto p-0">
              <Link href="tel:988" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Call 988
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="neubrutal border-2 border-black bg-cream sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="h-5 w-5 text-coral" />
              Support Resources
            </DialogTitle>
            <DialogDescription>It's okay to not be okay. Here are some resources that might help.</DialogDescription>
          </DialogHeader>

          {breathingExercise ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
                <div
                  className={`absolute h-32 w-32 rounded-full bg-coral transition-all duration-4000 ${
                    breathStep === 1
                      ? "scale-50 opacity-100"
                      : breathStep === 3
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-50"
                  }`}
                ></div>
                <div className="z-10 text-lg font-medium">
                  {breathStep === 1 && "Breathe in..."}
                  {breathStep === 2 && "Hold..."}
                  {breathStep === 3 && "Breathe out..."}
                  {breathStep === 4 && "Hold..."}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {breathStep > 0 ? "Just focus on your breathing..." : "Starting..."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <Button className="neubrutal-sm flex items-center justify-start gap-3 bg-coral text-black" asChild>
                <Link href="tel:988">
                  <Phone className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>Call 988</span>
                    <span className="text-xs">Suicide & Crisis Lifeline</span>
                  </div>
                </Link>
              </Button>

              <Button className="neubrutal-sm flex items-center justify-start gap-3 bg-mint text-black" asChild>
                <Link href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>Crisis Text Line</span>
                    <span className="text-xs">Text HOME to 741741</span>
                  </div>
                </Link>
              </Button>

              <Button
                onClick={startBreathingExercise}
                className="neubrutal-sm flex items-center justify-start gap-3 bg-lavender text-black"
              >
                <Sparkles className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Quick Breath Exercise</span>
                  <span className="text-xs">4-4-4-4 Box Breathing</span>
                </div>
              </Button>

              <div className="mt-2 rounded-lg border-2 border-black bg-white p-3 text-sm">
                <p className="font-medium">Remember:</p>
                <p>Your feelings are valid, and it's okay to ask for help.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
