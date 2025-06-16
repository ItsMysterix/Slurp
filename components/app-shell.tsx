"use client"

import type { ReactNode } from "react"
import { CollapsibleLayout } from "./collapsible-layout"
import { FloatingChatWidget } from "./floating-chat-widget"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <CollapsibleLayout>
      {children}
      <FloatingChatWidget />
    </CollapsibleLayout>
  )
}
