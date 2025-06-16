"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For now, simulate authentication check
        // Replace this with real Supabase auth later
        const mockUser = {
          id: "demo-user-123",
          email: "demo@slurp.app",
          name: "Demo User",
        }

        setUser(mockUser)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100">
        <div className="text-center border-2 border-black bg-red-100 p-8 rounded-lg shadow-[6px_6px_0px_#000]">
          <p className="text-black font-bold text-lg">🚫 Access denied</p>
          <p className="text-gray-700 mt-2">Please log in to continue</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Named export
export { ProtectedRoute }

// Default export for compatibility
export default ProtectedRoute
