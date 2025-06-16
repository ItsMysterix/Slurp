"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Calendar, Settings, Home, HelpCircle, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUserProfile, signOut, type UserProfile } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"

interface CollapsibleSidebarProps {
  collapsed: boolean
  toggleSidebar: () => void
}

export function CollapsibleSidebar({ collapsed }: CollapsibleSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error("Error loading profile for sidebar:", error)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const navItems = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: t("nav.dashboard"),
      gradient: "from-pink-200 to-rose-300",
    },
    {
      href: "/insights",
      icon: <BarChart3 className="h-5 w-5" />,
      label: t("nav.insights"),
      gradient: "from-purple-200 to-indigo-300",
    },
    {
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      label: t("nav.calendar"),
      gradient: "from-blue-200 to-cyan-300",
    },
    {
      href: "/journal",
      icon: <BookOpen className="h-5 w-5" />,
      label: t("nav.journal"),
      gradient: "from-yellow-200 to-amber-300",
    },
    {
      href: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
      label: t("nav.help"),
      gradient: "from-green-200 to-emerald-300",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-100 via-orange-100 to-pink-100 border-r-[4px] border-black shadow-[8px_0_0px_#000]">
      {/* Enhanced Header */}
      <div
        className={cn(
          "p-4 border-b-[3px] border-black bg-gradient-to-r from-strawberry to-peach",
          collapsed ? "px-2" : "",
        )}
      >
        <Link href="/dashboard" className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] flex-shrink-0">
            <img src="/slurp-app-icon.ico" alt="Slurp" width={32} height={32} className="rounded-full" />
          </div>
          {!collapsed && <span className="text-3xl font-black text-black truncate">Slurp.</span>}
        </Link>
      </div>

      <div className={cn("p-3", collapsed ? "px-2" : "")}></div>

      {/* Enhanced Navigation */}
      <nav className={cn("flex-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 w-full border-[3px] border-black font-bold",
                  pathname === item.href
                    ? `bg-gradient-to-r ${item.gradient} text-black shadow-[4px_4px_0px_#000] translate-x-[-2px] translate-y-[-2px]`
                    : "text-gray-700 hover:bg-white/50 hover:shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]",
                  collapsed ? "justify-center px-2" : "",
                )}
              >
                <div className="flex h-6 w-6 items-center justify-center flex-shrink-0">{item.icon}</div>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Enhanced User Profile Section */}
      <div
        className={cn(
          "border-t-[3px] border-black p-4 bg-gradient-to-r from-lime-200 to-green-200",
          collapsed ? "px-2" : "",
        )}
      >
        {/* Settings Button */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 mb-3 transition-all duration-200 w-full border-[3px] border-black font-bold text-gray-700 hover:bg-white/50 hover:shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]",
            collapsed ? "justify-center px-2" : "",
          )}
        >
          <div className="flex h-6 w-6 items-center justify-center flex-shrink-0">
            <Settings className="h-5 w-5" />
          </div>
          {!collapsed && <span className="truncate">{t("nav.settings")}</span>}
        </Link>
        <Link href="/profile">
          <Button
            variant="ghost"
            className={cn(
              "w-full gap-3 p-4 rounded-xl hover:bg-white/50 border-[3px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all",
              collapsed ? "justify-center px-2" : "justify-start",
            )}
          >
            <div className="w-12 h-12 rounded-full border-[3px] border-black bg-gradient-to-br from-strawberry to-peach flex items-center justify-center shadow-[2px_2px_0px_#000] flex-shrink-0 overflow-hidden">
              <img
                src={
                  profile?.profile_icon ? `/mood-icons/${profile.profile_icon}.ico` : "/mood-icons/strawberry-bliss.ico"
                }
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-sm font-black truncate w-full text-black">
                  Hello, {profile?.username || "Fruity Friend"}! 🍎
                </span>
                <span className="text-xs font-bold text-gray-700">Logged in</span>
              </div>
            )}
          </Button>
        </Link>
      </div>
    </div>
  )
}
