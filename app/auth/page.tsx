"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn, UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn, signUp } from "@/lib/supabase"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password)
        if (error) {
          throw new Error(error)
        }
        toast.success("Account created! Please check your email for verification.")
        // Don't redirect immediately for sign up, let them verify email first
      } else {
        const { data, error } = await signIn(email, password)
        if (error) {
          throw new Error(error)
        }
        toast.success("Welcome back to Slurp!")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      toast.error(error.message || "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-pink-100 p-4 font-sans text-black">
      <Card className="relative z-10 w-full max-w-md rounded-xl border-2 border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black p-6 text-center md:p-8">
          <CardTitle className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center justify-center gap-2">
            Welcome to Slurp
            <img src="/slurp-app-icon.ico" alt="Slurp" className="h-8 w-8 inline-block" />
          </CardTitle>
          <CardDescription className="pt-2 text-base font-medium text-black/80">
            Mood tracking never tasted this good.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="rounded-md border-2 border-black bg-white p-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="rounded-md border-2 border-black bg-white p-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg border-2 border-black py-3 text-lg font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isSignUp ? "bg-red-200 hover:bg-red-300" : "bg-red-200 hover:bg-red-300"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" /> Sign In
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-black hover:underline"
              disabled={isLoading}
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="relative z-10 mt-6">
        <Button variant="ghost" asChild className="text-black hover:bg-black/10">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
