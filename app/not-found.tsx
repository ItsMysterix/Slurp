import Link from "next/link"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/nav-bar" // Changed from import { NavBar }

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-peach-100 font-sans text-black">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <div className="space-y-8">
          <div className="text-6xl font-extrabold md:text-8xl">
            🥴<span className="mx-2">🍋</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-black sm:text-5xl md:text-6xl">
            Whoops, this flavor's off the menu
          </h1>
          <p className="mx-auto max-w-md text-lg font-medium md:text-xl">
            The page you're looking for doesn't exist. Maybe it melted away or was never mixed!
          </p>
          <div>
            <Button
              asChild
              className="rounded border-2 border-black bg-blueberry px-8 py-4 text-lg font-bold text-white shadow-neubrutal transition-all hover:bg-lemon hover:shadow-neubrutal-hover active:shadow-neubrutal-active"
            >
              <Link href="/">Take Me Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Slurp. Keep it flavorful!</p>
      </footer>
    </div>
  )
}
