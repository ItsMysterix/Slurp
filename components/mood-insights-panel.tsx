"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, MapPin, Clock, Filter, ChevronRight } from "lucide-react"
import Link from "next/link"

export function MoodInsightsPanel() {
  return (
    <Card className="neubrutal bg-white">
      <CardHeader className="border-b-2 border-black pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5" />
            Your Mood Patterns
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href="/insights">
              View All
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 rounded-lg border-2 border-black bg-muted p-1 sm:grid-cols-4">
            <TabsTrigger value="insights" className="rounded-md data-[state=active]:bg-white">
              <BarChart3 className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="people" className="rounded-md data-[state=active]:bg-white">
              <Users className="mr-2 h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="places" className="rounded-md data-[state=active]:bg-white">
              <MapPin className="mr-2 h-4 w-4" />
              Places
            </TabsTrigger>
            <TabsTrigger value="time" className="rounded-md data-[state=active]:bg-white">
              <Clock className="mr-2 h-4 w-4" />
              Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="neubrutal-sm bg-blueberry">
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold">Top 3 Triggers This Week</h3>
                  <ol className="ml-5 list-decimal">
                    <li className="mt-2">Work meetings (3 entries)</li>
                    <li className="mt-1">Morning commute (2 entries)</li>
                    <li className="mt-1">Coffee with Sarah (2 entries)</li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="neubrutal-sm bg-peach">
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold">Most Frequent Moods</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2 text-xl">🍑</span>
                        <div>
                          <div className="font-bold">Peachy Keen</div>
                          <div className="text-xs text-gray-500">Content</div>
                        </div>
                      </span>
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2 text-xl">🍓</span>
                        <div>
                          <div className="font-bold">Sweetberry Bliss</div>
                          <div className="text-xs text-gray-500">Happy</div>
                        </div>
                      </span>
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2 text-xl">🍍</span>
                        <div>
                          <div className="font-bold">Spiky Papaya</div>
                          <div className="text-xs text-gray-500">Stressed</div>
                        </div>
                      </span>
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="neubrutal-sm bg-mint">
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold">Mood After Meeting</h3>
                  <div className="mt-2">
                    <div className="mb-2 flex items-center">
                      <span className="mr-2 text-xl">👨‍💼</span>
                      <span>With Boss: </span>
                      <span className="ml-2 text-xl">🍍</span>
                      <span className="ml-1 text-xs text-gray-500">(Stressed)</span>
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="mr-2 text-xl">👩‍💻</span>
                      <span>With Team: </span>
                      <span className="ml-2 text-xl">🍓</span>
                      <span className="ml-1 text-xs text-gray-500">(Happy)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">👫</span>
                      <span>With Friends: </span>
                      <span className="ml-2 text-xl">🍇</span>
                      <span className="ml-1 text-xs text-gray-500">(Hopeful)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-black bg-lavender p-3">
              <span className="flex items-center gap-2 font-medium">
                <Filter className="h-4 w-4" />
                Mood Navigator
              </span>
              <Button size="sm" className="neubrutal-sm bg-white text-black">
                Filter Insights
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="people" className="mt-0">
            <div className="rounded-lg border-2 border-black bg-coral/20 p-4">
              <h3 className="mb-4 text-lg font-semibold">People Impact on Your Mood</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-coral text-lg">
                      👩‍💼
                    </div>
                    <div>
                      <p className="font-medium">Sarah (Coworker)</p>
                      <p className="text-sm text-muted-foreground">5 interactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍓</span>
                    <span className="text-xs text-gray-500">(Happy)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-coral text-lg">
                      👨‍💼
                    </div>
                    <div>
                      <p className="font-medium">Mike (Boss)</p>
                      <p className="text-sm text-muted-foreground">3 interactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍍</span>
                    <span className="text-xs text-gray-500">(Stressed)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-coral text-lg">
                      👨
                    </div>
                    <div>
                      <p className="font-medium">John (Friend)</p>
                      <p className="text-sm text-muted-foreground">4 interactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍇</span>
                    <span className="text-xs text-gray-500">(Hopeful)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="places" className="mt-0">
            <div className="rounded-lg border-2 border-black bg-sky/20 p-4">
              <h3 className="mb-4 text-lg font-semibold">Places Impact on Your Mood</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-sky text-lg">
                      🏠
                    </div>
                    <div>
                      <p className="font-medium">Home</p>
                      <p className="text-sm text-muted-foreground">12 entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍑</span>
                    <span className="text-xs text-gray-500">(Content)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-sky text-lg">
                      🏢
                    </div>
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-sm text-muted-foreground">8 entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍋</span>
                    <span className="text-xs text-gray-500">(Annoyed)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-sky text-lg">
                      ☕
                    </div>
                    <div>
                      <p className="font-medium">Coffee Shop</p>
                      <p className="text-sm text-muted-foreground">5 entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍓</span>
                    <span className="text-xs text-gray-500">(Happy)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time" className="mt-0">
            <div className="rounded-lg border-2 border-black bg-lime/20 p-4">
              <h3 className="mb-4 text-lg font-semibold">Time Impact on Your Mood</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-lime text-lg">
                      🌅
                    </div>
                    <div>
                      <p className="font-medium">Morning (6AM-12PM)</p>
                      <p className="text-sm text-muted-foreground">7 entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍋</span>
                    <span className="text-xs text-gray-500">(Annoyed)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-lime text-lg">
                      🌞
                    </div>
                    <div>
                      <p className="font-medium">Afternoon (12PM-6PM)</p>
                      <p className="text-sm text-muted-foreground">10 entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍓</span>
                    <span className="text-xs text-gray-500">(Happy)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-lime text-lg">
                      🌙
                    </div>
                    <div>
                      <p className="font-medium">Evening (6PM-12AM)</p>
                      <p className="text-sm text-muted-foreground">8 entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🍑</span>
                    <span className="text-xs text-gray-500">(Content)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
