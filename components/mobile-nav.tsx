"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, BarChart2, Calendar, BookOpen, Settings, HelpCircle, User } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      name: t("nav.dashboard"),
      href: "/dashboard",
      icon: Home,
    },
    {
      name: t("nav.add"),
      href: "/add",
      icon: PlusCircle,
    },
    {
      name: t("nav.insights"),
      href: "/insights",
      icon: BarChart2,
    },
    {
      name: t("nav.calendar"),
      href: "/calendar",
      icon: Calendar,
    },
    {
      name: t("nav.journal"),
      href: "/journal",
      icon: BookOpen,
    },
    {
      name: t("nav.settings"),
      href: "/settings",
      icon: Settings,
    },
    {
      name: t("nav.help"),
      href: "/help",
      icon: HelpCircle,
    },
    {
      name: t("nav.profile"),
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t-2 border-black bg-white md:hidden">
      <div className="grid h-16 grid-cols-4 font-medium">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group inline-flex flex-col items-center justify-center px-1 ${
              isActive(item.href) ? "bg-yellow-100 text-black" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <item.icon
              className={`mb-1 h-6 w-6 ${isActive(item.href) ? "text-black" : "text-gray-500 group-hover:text-black"}`}
            />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
