// Updated mood utilities with new custom icons

export interface FruityMood {
  id: string
  name: string
  iconPath: string
  emotion: string
  bgColor: string
  description: string
}

export const fruityMoods: FruityMood[] = [
  {
    id: "strawberry-bliss",
    name: "Strawberry Bliss",
    iconPath: "/mood-icons/strawberry-bliss.ico",
    emotion: "Happy",
    bgColor: "bg-pink-100",
    description: "Pure joy and happiness",
  },
  {
    id: "sour-lemon",
    name: "Sour Lemon",
    iconPath: "/mood-icons/sour-lemon.ico",
    emotion: "Sad",
    bgColor: "bg-yellow-100",
    description: "Feeling down and sour",
  },
  {
    id: "pineapple-punch",
    name: "Pineapple Punch",
    iconPath: "/mood-icons/pineapple-punch.ico",
    emotion: "Energetic",
    bgColor: "bg-orange-100",
    description: "Tropical energy and zest",
  },
  {
    id: "slippery-banana",
    name: "Slippery Banana",
    iconPath: "/mood-icons/slippery-banana.ico",
    emotion: "Confused",
    bgColor: "bg-yellow-50",
    description: "Feeling uncertain and slippery",
  },
  {
    id: "spiky-papaya",
    name: "Spiky Papaya",
    iconPath: "/mood-icons/spiky-papaya.ico",
    emotion: "Stressed",
    bgColor: "bg-red-100",
    description: "Feeling prickly and stressed",
  },
  {
    id: "watermelon-wave",
    name: "Watermelon Wave",
    iconPath: "/mood-icons/watermelon-wave.ico",
    emotion: "Calm",
    bgColor: "bg-green-100",
    description: "Peaceful and flowing like waves",
  },
  {
    id: "blueberry-burnout",
    name: "Blueberry Burnout",
    iconPath: "/mood-icons/blueberry-burnout.ico",
    emotion: "Exhausted",
    bgColor: "bg-blue-100",
    description: "Feeling drained and overwhelmed",
  },
  {
    id: "grape-expectations",
    name: "Grape Expectations",
    iconPath: "/mood-icons/grape-expectations.ico",
    emotion: "Hopeful",
    bgColor: "bg-purple-100",
    description: "Optimistic about the future",
  },
  {
    id: "peachy-keen",
    name: "Peachy Keen",
    iconPath: "/mood-icons/peachy-keen.ico",
    emotion: "Content",
    bgColor: "bg-peach",
    description: "Satisfied and at peace",
  },
  {
    id: "mango-mania",
    name: "Mango Mania",
    iconPath: "/mood-icons/mango-mania.ico",
    emotion: "Excited",
    bgColor: "bg-yellow-200",
    description: "Thrilled and enthusiastic",
  },
  {
    id: "apple-clarity",
    name: "Apple Clarity",
    iconPath: "/mood-icons/apple-clarity.ico",
    emotion: "Focused",
    bgColor: "bg-green-50",
    description: "Clear minded and focused",
  },
  {
    id: "cherry-charge",
    name: "Cherry Charge",
    iconPath: "/mood-icons/cherry-charge.ico",
    emotion: "Motivated",
    bgColor: "bg-red-50",
    description: "Charged up and ready to go",
  },
  {
    id: "fiery-guava",
    name: "Fiery Guava",
    iconPath: "/mood-icons/fiery-guava.ico",
    emotion: "Angry",
    bgColor: "bg-red-200",
    description: "Feeling fiery and intense",
  },
  {
    id: "peer-pressure",
    name: "Peer Pressure",
    iconPath: "/mood-icons/peer-pressure.ico",
    emotion: "Anxious",
    bgColor: "bg-gray-100",
    description: "Feeling pressured and anxious",
  },
  {
    id: "musk-melt",
    name: "Musk Melt",
    iconPath: "/mood-icons/musk-melt.ico",
    emotion: "Relaxed",
    bgColor: "bg-purple-50",
    description: "Melting into relaxation",
  },
  {
    id: "kiwi-comeback",
    name: "Kiwi Comeback",
    iconPath: "/mood-icons/kiwi-comeback.ico",
    emotion: "Determined",
    bgColor: "bg-green-200",
    description: "Making a strong comeback",
  },
]

export const emotionToFruityMood: Record<string, FruityMood> = {
  Happy: fruityMoods.find((m) => m.id === "strawberry-bliss")!,
  Sad: fruityMoods.find((m) => m.id === "sour-lemon")!,
  Energetic: fruityMoods.find((m) => m.id === "pineapple-punch")!,
  Confused: fruityMoods.find((m) => m.id === "slippery-banana")!,
  Stressed: fruityMoods.find((m) => m.id === "spiky-papaya")!,
  Calm: fruityMoods.find((m) => m.id === "watermelon-wave")!,
  Exhausted: fruityMoods.find((m) => m.id === "blueberry-burnout")!,
  Hopeful: fruityMoods.find((m) => m.id === "grape-expectations")!,
  Content: fruityMoods.find((m) => m.id === "peachy-keen")!,
  Excited: fruityMoods.find((m) => m.id === "mango-mania")!,
}

export function getRandomFruityMood(): FruityMood {
  const randomIndex = Math.floor(Math.random() * fruityMoods.length)
  return fruityMoods[randomIndex]
}

export function getFruityMoodById(id: string): FruityMood | undefined {
  return fruityMoods.find((mood) => mood.id === id)
}

export function getFruityMoodByEmotion(emotion: string): FruityMood | undefined {
  return emotionToFruityMood[emotion] || fruityMoods[0]
}

// Add function to get profile icon options
export function getProfileIconOptions(): FruityMood[] {
  return fruityMoods
}

// Add function to get icon path by mood ID
export function getIconPathById(id: string): string {
  const mood = fruityMoods.find((m) => m.id === id)
  return mood?.iconPath || "/mood-icons/strawberry-bliss.ico"
}

// MoodIcon component moved to components/mood-icon.tsx
