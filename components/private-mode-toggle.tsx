"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { InfoIcon } from "lucide-react"

interface PrivateModeToggleProps {
  onModeChange?: (mode: "local" | "cloud") => void
}

export function PrivateModeToggle({ onModeChange }: PrivateModeToggleProps) {
  // Default to private mode (local storage)
  const [isPrivateMode, setIsPrivateMode] = useState(true)
  const [storageMode, setStorageMode] = useState<"local" | "cloud">("local")

  // TODO: Check current mode from localStorage on page load
  useEffect(() => {
    const savedMode = localStorage.getItem("slurpMode")
    if (savedMode === "cloud") {
      setIsPrivateMode(false)
      setStorageMode("cloud")
    } else {
      // Default to local/private if not set or is "local"
      setIsPrivateMode(true)
      setStorageMode("local")
    }
  }, [])

  const handleToggle = (checked: boolean) => {
    const newMode = checked ? "local" : "cloud"
    setIsPrivateMode(checked)
    setStorageMode(newMode)
    localStorage.setItem("slurpMode", newMode)

    if (onModeChange) {
      onModeChange(newMode)
    }

    // Show toast notification based on the new mode
    if (newMode === "local") {
      toast("Private Peach Mode enabled", {
        description: "🍑 Mood entries will be stored only on your device",
        position: "top-center",
      })
    } else {
      toast("Cloud storage enabled", {
        description: "☁️ Mood entries will be saved to your account",
        position: "top-center",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={`sticky top-0 z-10 border-2 border-black p-3 shadow-neubrutal-sm transition-colors duration-300 ${
          isPrivateMode ? "bg-peach" : "bg-cream"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">Private Peach Mode</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 cursor-help text-black/70" />
                </TooltipTrigger>
                <TooltipContent className="border-2 border-black bg-white p-3 shadow-neubrutal-sm">
                  <p className="max-w-xs">When ON, all mood logs are saved only on your device.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch checked={isPrivateMode} onCheckedChange={handleToggle} className="data-[state=checked]:bg-black" />
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isPrivateMode ? "auto" : 0,
            opacity: isPrivateMode ? 1 : 0,
          }}
          className="overflow-hidden"
        >
          {isPrivateMode && (
            <p className="mt-2 text-sm text-black/70">🍑 Your mood entries are currently stored only on this device</p>
          )}
        </motion.div>
      </Card>
    </motion.div>
  )
}
