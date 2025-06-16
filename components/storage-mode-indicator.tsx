"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function StorageModeIndicator() {
  const [storageMode, setStorageMode] = useState<"local" | "cloud">("local")

  // TODO: Check current mode from localStorage on page load
  useEffect(() => {
    const savedMode = localStorage.getItem("slurpMode") as "local" | "cloud" | null
    if (savedMode) {
      setStorageMode(savedMode)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 rounded-lg border-2 border-black p-3 text-center text-sm ${
        storageMode === "local" ? "bg-peach/50" : "bg-blue-100/50"
      }`}
    >
      {storageMode === "local" ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🍑</span>
          <span>Private Peach Mode: Your mood entries are stored only on this device</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">☁️</span>
          <span>Cloud Mode: Your mood entries are synced to your account</span>
        </div>
      )}
    </motion.div>
  )
}
