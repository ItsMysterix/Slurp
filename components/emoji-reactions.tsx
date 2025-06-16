"use client"

interface EmojiReactionsProps {
  onSelect: (emoji: string) => void
}

export function EmojiReactions({ onSelect }: EmojiReactionsProps) {
  const quickEmojis = ["😊", "😔", "��", "😓", "🥳", "😌", "👍", "👎"]

  return (
    <div className="flex flex-wrap justify-center gap-2 rounded-xl border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      {quickEmojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-cream text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-110 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
