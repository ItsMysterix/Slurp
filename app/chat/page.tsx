"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
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

  const handleSuggestionSelect = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
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
    <div className="flex min-h-screen flex-col bg-pastel-cream">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 border-b-2 border-black bg-pastel-cream/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="flex items-center text-2xl font-bold">
            <span className="mr-2 text-3xl">🍵</span>
            Talk to Slurpy
          </h1>
          <div className="w-10"></div> {/* Empty div for centering */}
        </div>
      </header>

      {/* Chat Messages Container */}
      <main className="flex-1 overflow-hidden p-4">
        <div className="container mx-auto h-full max-w-3xl">
          <div className="flex h-[calc(100vh-13rem)] flex-col overflow-y-auto rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex-1 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-pastel-mint text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      🍵
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl border-2 border-black p-3 ${
                      message.role === "user" ? "bg-pastel-pink" : "bg-pastel-mint"
                    } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    <p className="text-black">{message.content}</p>
                    <p className="mt-1 text-right text-xs text-black/60">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-pastel-pink text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      👤
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-pastel-mint text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    🍵
                  </div>
                  <div className="max-w-[80%] rounded-xl border-2 border-black bg-pastel-mint p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-black"></div>
                      </div>
                      <p className="text-black">Slurpy is thinking...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestion chips */}
          {messages.length < 3 && !isLoading && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSuggestionSelect("How are you today?")}
                  className="rounded-full border-2 border-black bg-pastel-peach px-4 py-2 text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  How are you today?
                </button>
                <button
                  onClick={() => handleSuggestionSelect("I'm feeling sad")}
                  className="rounded-full border-2 border-black bg-pastel-lavender px-4 py-2 text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  I'm feeling sad
                </button>
                <button
                  onClick={() => handleSuggestionSelect("Tell me a joke")}
                  className="rounded-full border-2 border-black bg-pastel-lemon px-4 py-2 text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  Tell me a joke
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Message Input */}
      <div className="sticky bottom-0 border-t-2 border-black bg-pastel-cream p-4">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-xl border-2 border-black bg-white py-6 pr-14 text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-2 focus:ring-black focus:ring-offset-2"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border-2 border-black bg-pastel-pink p-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
