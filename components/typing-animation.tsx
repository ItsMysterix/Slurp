"use client"

import { useEffect, useState } from "react"

export function TypingAnimation() {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-black"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-black" style={{ animationDelay: "0.2s" }}></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-black" style={{ animationDelay: "0.4s" }}></div>
    </div>
  )
}
