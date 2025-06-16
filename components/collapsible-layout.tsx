"use client"

import { useState, useEffect, type ReactNode } from "react"
import { PanelLeft, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"

interface CollapsibleLayoutProps {
  children: ReactNode
}

export function CollapsibleLayout({ children }: CollapsibleLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setCollapsed(savedState === "true")
    }
  }, [])

  // Save collapse state to localStorage only after mounting
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarCollapsed", collapsed.toString())
    }
  }, [collapsed, mounted])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const sidebarWidth = collapsed ? 75 : 240

  // Prevent hydration mismatch by using consistent initial state
  if (!mounted) {
    return (
      <div className="flex h-screen bg-cream">
        <aside className="fixed top-0 left-0 h-screen bg-white border-r-2 border-black transition-all duration-300 z-40 w-[240px]">
          <div className="absolute -right-3 top-8 z-50">
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-cream hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
            >
              <PanelLeftClose className="h-5 w-5 text-black" />
            </Button>
          </div>
          <div className="h-full overflow-hidden">
            <CollapsibleSidebar collapsed={false} toggleSidebar={() => {}} />
          </div>
        </aside>
        <main
          className="overflow-y-scroll overflow-x-hidden transition-all duration-300 p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 min-h-screen"
          style={{
            marginLeft: "240px",
            width: "calc(100vw - 240px)",
          }}
        >
          <div className="bg-gradient-to-br from-pink-200 via-yellow-200 to-purple-200 border-[4px] border-black shadow-[8px_8px_0px_#000] rounded-xl p-6 min-h-[calc(100vh-3rem)] relative overflow-hidden">
            <div className="absolute top-4 right-4 w-8 h-8 bg-red-400 border-2 border-black rounded-full shadow-[4px_4px_0px_#000]"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-blue-400 border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] rotate-12"></div>
            <div className="absolute top-1/3 right-8 w-4 h-4 bg-green-400 border-2 border-black rounded-full shadow-[2px_2px_0px_#000]"></div>
            <div className="relative z-10">{children}</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r-2 border-black transition-all duration-300 z-40 ${
          collapsed ? "w-[75px]" : "w-[240px]"
        }`}
      >
        {/* Toggle Button */}
        <div className="absolute -right-3 top-8 z-50">
          <Button
            onClick={toggleSidebar}
            size="icon"
            className="h-10 w-10 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-cream hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5 text-black" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-black" />
            )}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="h-full overflow-hidden">
          <CollapsibleSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="overflow-y-scroll overflow-x-hidden transition-all duration-300 p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 min-h-screen"
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div className="bg-gradient-to-br from-pink-200 via-yellow-200 to-purple-200 border-[4px] border-black shadow-[8px_8px_0px_#000] rounded-xl p-6 min-h-[calc(100vh-3rem)] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-red-400 border-2 border-black rounded-full shadow-[4px_4px_0px_#000]"></div>
          <div className="absolute bottom-6 left-6 w-6 h-6 bg-blue-400 border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] rotate-12"></div>
          <div className="absolute top-1/3 right-8 w-4 h-4 bg-green-400 border-2 border-black rounded-full shadow-[2px_2px_0px_#000]"></div>

          {/* Content wrapper */}
          <div className="relative z-10">{children}</div>
        </div>
      </main>
    </div>
  )
}
