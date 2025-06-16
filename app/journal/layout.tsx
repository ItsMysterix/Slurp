import type { ReactNode } from "react"

interface JournalLayoutProps {
  children: ReactNode
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return <>{children}</>
}
