import type { ReactNode } from "react"

interface GratitudeLayoutProps {
  children: ReactNode
}

export default function GratitudeLayout({ children }: GratitudeLayoutProps) {
  return <>{children}</>
}
