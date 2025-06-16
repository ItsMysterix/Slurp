"use client"

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const suggestions = [
    "How are you today?",
    "I'm feeling sad",
    "Tell me a joke",
    "What should I do when I'm stressed?",
    "Help me relax",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="rounded-full border-2 border-black bg-pastel-peach px-4 py-2 text-sm font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
