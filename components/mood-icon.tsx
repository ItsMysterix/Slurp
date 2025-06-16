import type { FruityMood } from "@/lib/mood-utils"

interface MoodIconProps {
  mood: FruityMood
  size?: number
  className?: string
}

export function MoodIcon({ mood, size = 24, className = "" }: MoodIconProps) {
  return (
    <img
      src={mood.iconPath || "/placeholder.svg"}
      alt={mood.name}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      title={`${mood.name} - ${mood.description}`}
    />
  )
}

// Also export as default for flexibility
export default MoodIcon
