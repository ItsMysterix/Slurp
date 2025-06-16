"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit3, Trash2, MessageCircle, Loader2 } from "lucide-react"
import { BackgroundIllustrations } from "@/components/background-illustrations"
import { StorageModeIndicator } from "@/components/storage-mode-indicator"
import { getMoodEntries, deleteMoodEntry, isAuthenticated, type MoodEntry } from "@/lib/supabase"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SlurpPage() {
  const router = useRouter()
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const checkAuthAndLoadMoods = async () => {
      try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }

        const result = await getMoodEntries()
        if (result.success && result.data) {
          setMoods(result.data)
        } else {
          setError(result.error || "Failed to load mood entries")
        }
      } catch (err) {
        setError("An error occurred while loading mood entries")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadMoods()
  }, [router])

  const handleDelete = async (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      setIsDeleting(true)
      const result = await deleteMoodEntry(deleteId)

      if (result.success) {
        setMoods(moods.filter((mood) => mood.id !== deleteId))
        alert("Mood entry deleted successfully")
      } else {
        throw new Error(result.error || "Failed to delete mood entry")
      }
    } catch (err) {
      alert(`Failed to delete mood entry: ${(err as Error).message}`)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteId(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-black" />
          <p className="mt-2 text-black font-medium">Loading your mood entries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-cream font-sans">
      <BackgroundIllustrations variant="dashboard" />
      <NavBar />

      <main className="relative z-10 flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-black md:text-4xl">🍹 Your Fruity Mood Timeline</h1>
            </div>
            <div className="flex gap-4">
              <Button
                asChild
                className="rounded-lg border-2 border-black bg-strawberry px-4 py-2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-strawberry/80 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <Link href="/add">+ New Mood</Link>
              </Button>
              <Button
                asChild
                className="rounded-lg border-2 border-black bg-lime-200 px-4 py-2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-lime-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <Link href="/chat" className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Talk to Slurpy 🍵
                </Link>
              </Button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border-2 border-black bg-coral p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-bold text-black">🚨 {error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Try Again
              </Button>
            </div>
          ) : moods.length === 0 ? (
            <div className="rounded-lg border-2 border-black bg-peach p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4 text-6xl">🍹</div>
              <h2 className="mb-2 text-2xl font-bold text-black">No mood entries yet!</h2>
              <p className="mb-6 text-black">Start tracking your moods to see them appear here.</p>
              <Button
                asChild
                className="border-2 border-black bg-strawberry text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Link href="/add">Add Your First Mood</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moods.map((mood) => (
                <Card
                  key={mood.id}
                  className={`flex flex-col rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${mood.bg_color} text-black`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-black/70">
                        {format(new Date(mood.created_at), "MMMM d, yyyy")}
                      </p>
                      <div className="text-4xl">{mood.emoji}</div>
                    </div>
                    <CardTitle className="pt-1 text-2xl font-bold tracking-tight text-black">
                      {mood.mood_name}
                    </CardTitle>
                    <p className="text-sm font-medium text-black/80">{mood.emotion}</p>
                    {mood.is_private && (
                      <div className="mt-1 inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-bold text-black">
                        🔒 Private
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm leading-relaxed text-black">{mood.note || "No notes added"}</p>
                    {mood.location && (
                      <div className="mt-3 inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-bold text-black">
                        📍 {mood.location}
                      </div>
                    )}
                  </CardContent>
                  <div className="mt-auto flex gap-3 p-4 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 border-2 border-black bg-white font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Link href={`/edit/${mood.id}`}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 border-2 border-black bg-white font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      onClick={() => handleDelete(mood.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="container mx-auto px-4 md:px-6 mb-6">
        <StorageModeIndicator />
      </div>

      <footer className="relative z-10 mt-auto border-t-2 border-black bg-cream py-6">
        <div className="container mx-auto px-4 text-center md:px-6">
          <p className="text-sm text-black font-medium">
            Keep on Slurpin'! 🍹 &copy; {new Date().getFullYear()} Slurp.
          </p>
        </div>
      </footer>

      <AlertDialog open={deleteId !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black font-bold">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-black/80">
              This will permanently delete this mood entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="border-2 border-black bg-red-500 text-white hover:bg-red-600 font-bold"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
