import { MoodSelector } from "../../mood-selector"

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Slurp Mood Tracker</h1>
        <MoodSelector />
      </div>
    </div>
  )
}
