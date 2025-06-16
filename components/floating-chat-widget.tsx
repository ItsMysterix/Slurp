"use client"

import { useState, useEffect, useRef } from "react"

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [chatWindowRef])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div ref={chatWindowRef} className="w-96 h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center space-x-3">
            <img
              src="/slurpy-chatbot.ico"
              alt="Slurpy"
              width={32}
              height={32}
              className="rounded-full border-2 border-black"
            />
            <h3 className="text-lg font-semibold">Slurpy Chat</h3>
          </div>
          <div className="p-4 h-[450px] overflow-y-auto">
            {/* Chat messages will go here */}
            <p>This is where the chat messages will be displayed.</p>
          </div>
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      
    </div>
  )
}

export { FloatingChatWidget }
