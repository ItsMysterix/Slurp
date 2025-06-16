"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"
import { TypingIndicator } from "@/components/typing-indicator"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function SlurpyChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm Slurpy, your emotional support fruit buddy. How are you feeling today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: input,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Show a toast if we're using fallback responses
      if (data.note) {
        toast.info("Using fallback responses", {
          description: "Slurpy is having trouble connecting to its brain",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! I had trouble processing that. Could you try again?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
        {/* Enhanced Neubrutalist Header */}
        <header className="sticky top-0 z-10 border-b-[4px] border-black bg-gradient-to-r from-orange-200 to-pink-200 backdrop-blur shadow-[0_8px_0px_#000]">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-xl border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_#000]"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-black bg-gradient-to-br from-lime-200 to-green-300 text-3xl shadow-[4px_4px_0px_#000]">
                🍵
              </div>
              <h1 className="text-3xl font-black text-black">Talk to Slurpy</h1>
            </div>
            <div className="w-12"></div> {/* Empty div for centering */}
          </div>
        </header>

        {/* Enhanced Chat Messages Container */}
        <main className="flex-1 overflow-hidden p-6">
          <div className="container mx-auto h-full max-w-4xl">
            <div className="flex h-[calc(100vh-15rem)] flex-col overflow-y-auto rounded-2xl border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_#000]">
              <div className="flex-1 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-gradient-to-br from-lime-200 to-green-300 text-2xl shadow-[4px_4px_0px_#000] flex-shrink-0">
                        🍵
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl border-[3px] border-black p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-pink-200 to-rose-300 shadow-[4px_4px_0px_#000]"
                          : "bg-gradient-to-br from-lime-200 to-green-200 shadow-[4px_4px_0px_#000]"
                      }`}
                    >
                      <p className="text-black font-medium leading-relaxed">{message.content}</p>
                      <p className="mt-2 text-right text-xs font-bold text-black/70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-gradient-to-br from-pink-200 to-rose-300 text-2xl shadow-[4px_4px_0px_#000] flex-shrink-0">
                        👤
                      </div>
                    )}
                  </div>
                ))}

                {/* Enhanced Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-gradient-to-br from-lime-200 to-green-300 text-2xl shadow-[4px_4px_0px_#000] flex-shrink-0">
                      🍵
                    </div>
                    <div className="max-w-[75%] rounded-2xl border-[3px] border-black bg-gradient-to-br from-lime-200 to-green-200 p-4 shadow-[4px_4px_0px_#000]">
                      <div className="flex items-center space-x-3">
                        <TypingIndicator />
                        <p className="text-black font-medium">Slurpy is thinking...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Message Input */}
        <div className="sticky bottom-0 border-t-[4px] border-black bg-gradient-to-r from-cyan-200 to-blue-200 p-6 shadow-[0_-8px_0px_#000]">
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message to Slurpy..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="rounded-2xl border-[3px] border-black bg-white py-8 pr-20 text-lg font-medium shadow-[4px_4px_0px_#000] focus:ring-4 focus:ring-black focus:ring-offset-4 placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border-[3px] border-black bg-gradient-to-br from-pink-400 to-rose-500 p-3 text-black shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-6 w-6" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
