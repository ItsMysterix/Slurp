"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { signUp, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const { error } = await signUp(email, password)

      if (error) {
        throw error
      }

      // Success message is shown in the auth context
      router.push("/login")
    } catch (error) {
      toast.error("Sign up failed", {
        description: (error as Error).message || "Please try again with a different email.",
      })
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-cream bg-dots p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        <Card className="neubrutal bg-white">
          <CardHeader>
            <div className="flex items-center justify-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-strawberry text-2xl shadow-neubrutal-sm">
                🍹
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Create your Slurp account</CardTitle>
            <CardDescription className="text-center">Start tracking your mood journey today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="neubrutal-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="neubrutal-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="neubrutal-sm"
                />
              </div>
              <Button type="submit" className="w-full neubrutal bg-strawberry text-black" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blueberry hover:underline">
                Log in
              </Link>
            </div>
            <Button asChild variant="link" className="mt-2">
              <Link href="/">Back to home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
