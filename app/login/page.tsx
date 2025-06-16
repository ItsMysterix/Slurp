"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, signUp } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        const result = await signUp(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess("Account created! Please check your email to verify your account.")
        }
      } else {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess("Login successful! Redirecting...")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      }
    } catch (error: any) {
      setError("An unexpected error occurred: " + (error.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-black shadow-[8px_8px_0px_#000] bg-white">
        <CardHeader className="border-b-2 border-black bg-yellow-100 p-6">
          <CardTitle className="text-center text-3xl font-bold text-black">🍹 Welcome to Slurp!</CardTitle>
          <p className="text-center text-gray-600 mt-2">
            {isSignUp ? "Create your fruity mood tracker account" : "Sign in to track your moods"}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-black shadow-[2px_2px_0px_#000] focus:shadow-[4px_4px_0px_#000]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-black shadow-[2px_2px_0px_#000] focus:shadow-[4px_4px_0px_#000]"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
                <p className="text-red-700 font-medium">❌ {error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
                <p className="text-green-700 font-medium">✅ {success}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-2 border-black bg-blue-200 hover:bg-blue-300 text-black font-bold py-3 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] disabled:opacity-50"
            >
              {isLoading ? "⏳ Loading..." : isSignUp ? "🍓 Create Account" : "🍹 Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-black hover:underline font-medium"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-600 hover:underline text-sm">
              ← Back to Home
            </Link>
          </div>

          {/* Demo Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
            <h3 className="font-bold text-black mb-2">🧪 Demo Instructions:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Create an account with any email</p>
              <p>2. Use a password with at least 6 characters</p>
              <p>3. Check your email for verification (if required)</p>
              <p>4. Start tracking your moods! 🍹</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
