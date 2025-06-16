"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react"
import { MoodIcon } from "@/components/mood-icon"
import { fruityMoods } from "@/lib/mood-utils"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
      {/* Navigation */}
      <nav className="border-b-[3px] border-black bg-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 bg-red-400 border-2 border-black rounded-full flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_#000] overflow-hidden">
              <img src="/slurp-app-icon.ico" alt="Slurp Logo" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-black text-white relative">
              <span className="absolute top-1 left-1 text-red-500 -z-10">Slurp.</span>
              <span className="absolute top-0.5 left-0.5 text-yellow-500 -z-5">Slurp.</span>
              <span className="relative z-10 text-black">Slurp.</span>
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              asChild
              className="border-[2px] border-black bg-white font-bold shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="border-[2px] border-black bg-strawberry font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-red-400 hover:shadow-[4px_4px_0px_#000]"
            >
              {isLoading ? "Loading..." : "Get Started"}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <div className="h-20 w-20 bg-red-400 border-4 border-black rounded-full flex items-center justify-center font-bold text-black shadow-[4px_4px_0px_#000] mx-auto mb-4 overflow-hidden">
              <img src="/slurp-app-icon.ico" alt="Slurp Logo" className="h-14 w-14" />
            </div>
            <h1 className="text-6xl font-black text-black mb-4 leading-tight">
              Track Your Moods
              <br />
              <span className="text-red-500">Fruity Style!</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Transform your emotional journey into a delicious adventure. Track, understand, and improve your mental
              wellbeing with our fun, fruit-themed mood tracker.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              size="lg"
              className="text-xl px-8 py-4 border-[3px] border-black bg-red-400 font-black text-black shadow-[6px_6px_0px_#000] hover:bg-red-500 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              {isLoading ? "Starting..." : "Start Your Journey"}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </motion.div>

        {/* S.L.U.R.P. Letter Cards - Special Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-white border-[4px] border-black rounded-3xl shadow-[8px_8px_0px_#000] p-12"
        >
          <h2 className="text-4xl font-black text-black mb-8 text-center">What Makes Slurp. Special?</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {/* S Card */}
            <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-strawberry hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-32 h-40">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center bg-red-200">
                <div className="text-6xl font-black text-black mb-2">S</div>
                <p className="text-sm font-bold text-black">Smart</p>
                <p className="text-xs text-gray-700">Insights</p>
              </CardContent>
            </Card>

            {/* L Card */}
            <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-lemon hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-32 h-40">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center bg-yellow-200">
                <div className="text-6xl font-black text-black mb-2">L</div>
                <p className="text-sm font-bold text-black">Lovely</p>
                <p className="text-xs text-gray-700">Interface</p>
              </CardContent>
            </Card>

            {/* U Card */}
            <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-grape hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-32 h-40">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center bg-purple-200">
                <div className="text-6xl font-black text-black mb-2">U</div>
                <p className="text-sm font-bold text-black">Unique</p>
                <p className="text-xs text-gray-700">Experience</p>
              </CardContent>
            </Card>

            {/* R Card */}
            <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-orange-100 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-32 h-40">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center bg-orange-200">
                <div className="text-6xl font-black text-black mb-2">R</div>
                <p className="text-sm font-bold text-black">Real</p>
                <p className="text-xs text-gray-700">Results</p>
              </CardContent>
            </Card>

            {/* P Card */}
            <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-green-100 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-32 h-40">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center bg-green-200">
                <div className="text-6xl font-black text-black mb-2">P</div>
                <p className="text-sm font-bold text-black">Private</p>
                <p className="text-xs text-gray-700">& Safe</p>
              </CardContent>
            </Card>

            {/* . Card */}
            <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-blue-100 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-32 h-40">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center bg-blue-200">
                <div className="text-6xl font-black text-black mb-2">.</div>
                <p className="text-sm font-bold text-black">Perfect</p>
                <p className="text-xs text-gray-700">Finish</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {/* Feature 1 */}
          <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-yellow-100 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <CardHeader className="border-b-[3px] border-black bg-yellow-200 rounded-t-2xl">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <div className="w-8 h-8 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-white rounded-sm flex items-center justify-center">
                  <MoodIcon mood={fruityMoods.find((m) => m.id === "strawberry-bliss")} size={24} />
                </div>
                <span>Fruity Moods</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-gray-700 text-lg">
                Express your emotions through delicious fruit metaphors. From Strawberry Bliss to Sour Lemon days!
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-blue-100 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <CardHeader className="border-b-[3px] border-black bg-blue-200 rounded-t-2xl">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <TrendingUp className="h-8 w-8" />
                <span>Smart Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 text-lg">
                Discover patterns in your emotional journey with beautiful charts and personalized recommendations.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] bg-green-100 hover:shadow-[8px_8px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <CardHeader className="border-b-[3px] border-black bg-green-200 rounded-t-2xl">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Shield className="h-8 w-8" />
                <span>Private & Safe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 text-lg">
                Your emotional data stays secure with end-to-end encryption and optional local-only storage.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood Examples */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-black mb-8">Meet Your Fruity Emotions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              fruityMoods.find((m) => m.id === "strawberry-bliss"),
              fruityMoods.find((m) => m.id === "sour-lemon"),
              fruityMoods.find((m) => m.id === "grape-expectations"),
              fruityMoods.find((m) => m.id === "pineapple-punch"),
            ]
              .filter(Boolean)
              .map((mood, index) => (
                <motion.div
                  key={mood.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="p-6 rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="w-16 h-16 border-[3px] border-black shadow-[3px_3px_0px_#000] bg-white rounded-lg flex items-center justify-center">
                      <MoodIcon mood={mood} size={48} />
                    </div>
                  </div>
                  <h3 className="font-black text-lg text-black mb-2">{mood.name}</h3>
                  <p className="text-gray-600 text-sm">{mood.description}</p>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-red-200 via-yellow-200 to-blue-200 p-12 rounded-3xl border-[4px] border-black shadow-[8px_8px_0px_#000]"
        >
          <h2 className="text-4xl font-black text-black mb-4">Ready to Start Your Fruity Journey?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've transformed their emotional wellbeing with Slurp. It's free, fun, and
            surprisingly insightful!
          </p>
          <Button
            onClick={handleGetStarted}
            disabled={isLoading}
            size="lg"
            className="text-2xl px-12 py-6 border-[4px] border-black bg-red-400 font-black text-black shadow-[8px_8px_0px_#000] hover:bg-red-500 hover:shadow-[10px_10px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            <Sparkles className="mr-3 h-7 w-7" />
            {isLoading ? "Getting Started..." : "Get Started Free"}
            <ArrowRight className="ml-3 h-7 w-7" />
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t-[3px] border-black bg-white p-8 mt-16">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 bg-red-400 border-2 border-black rounded-full flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_#000] overflow-hidden">
              <img src="/slurp-app-icon.ico" alt="Slurp Logo" className="h-4 w-4" />
            </div>
            <span className="text-xl font-black text-black">Slurp.</span>
          </div>
          <p className="text-gray-600">
            Made with 💖 for better mental health. Track your moods, understand your patterns, live your best life.
          </p>
        </div>
      </footer>
    </div>
  )
}
