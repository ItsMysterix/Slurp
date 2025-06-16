"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, signIn, signUp, signOut } from "@/lib/supabase-client"

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    setIsLoading(true)
    addResult("🔍 Checking current user...")
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        addResult(`✅ User found: ${currentUser.email} (ID: ${currentUser.id})`)
      } else {
        addResult("❌ No user found")
      }
    } catch (error) {
      addResult(`❌ Error checking user: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSignUp = async () => {
    addResult("🔐 Testing sign up...")
    try {
      const result = await signUp("test@example.com", "password123")
      if (result.user) {
        addResult(`✅ Sign up successful: ${result.user.email}`)
        await checkCurrentUser()
      } else {
        addResult(`❌ Sign up failed: ${result.error?.message}`)
      }
    } catch (error) {
      addResult(`❌ Sign up error: ${error}`)
    }
  }

  const testSignIn = async () => {
    addResult("🔐 Testing sign in...")
    try {
      const result = await signIn("test@example.com", "password123")
      if (result.user) {
        addResult(`✅ Sign in successful: ${result.user.email}`)
        await checkCurrentUser()
      } else {
        addResult(`❌ Sign in failed: ${result.error?.message}`)
      }
    } catch (error) {
      addResult(`❌ Sign in error: ${error}`)
    }
  }

  const testSignOut = async () => {
    addResult("🔐 Testing sign out...")
    try {
      await signOut()
      addResult("✅ Sign out successful")
      await checkCurrentUser()
    } catch (error) {
      addResult(`❌ Sign out error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_#000] mb-6">
          <CardHeader className="border-b-2 border-black p-6">
            <CardTitle className="text-3xl font-bold text-black">🧪 Auth Test Page</CardTitle>
            <p className="text-gray-600">Test Supabase authentication functionality</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
                <h3 className="font-bold text-lg mb-2">Current Status:</h3>
                {isLoading ? (
                  <p>🔄 Loading...</p>
                ) : user ? (
                  <div>
                    <p>
                      ✅ <strong>Logged in as:</strong> {user.email}
                    </p>
                    <p>
                      🆔 <strong>User ID:</strong> {user.id}
                    </p>
                    <p>
                      📅 <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p>
                    ❌ <strong>Not logged in</strong>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={checkCurrentUser} className="bg-blue-400 border-2 border-black">
                  🔍 Check Current User
                </Button>
                <Button onClick={testSignUp} className="bg-green-400 border-2 border-black">
                  📝 Test Sign Up
                </Button>
                <Button onClick={testSignIn} className="bg-yellow-400 border-2 border-black">
                  🔐 Test Sign In
                </Button>
                <Button onClick={testSignOut} className="bg-red-400 border-2 border-black">
                  🚪 Test Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_#000]">
          <CardHeader className="border-b-2 border-black p-6">
            <CardTitle className="text-xl font-bold text-black">📋 Test Results</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p>No tests run yet...</p>
              ) : (
                testResults.map((result, index) => <div key={index}>{result}</div>)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
