"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Clock, Zap, CheckCircle } from "lucide-react"
import { getAllGameResults } from "@/lib/game-storage"
import type { GameResult, GameMode } from "@/lib/types"

export default function StatsTracker({ username }: { username: string }) {
  const [userResults, setUserResults] = useState<GameResult[]>([])
  const [timeFrame, setTimeFrame] = useState<"all" | "week" | "month">("all")
  const [gameMode, setGameMode] = useState<GameMode | "all">("all")

  const [averageWpm, setAverageWpm] = useState(0)
  const [maxWpm, setMaxWpm] = useState(0)
  const [averageAccuracy, setAverageAccuracy] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [completedGames, setCompletedGames] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const results = getAllGameResults().filter((result) => result.username === username)
    setUserResults(results)
  }, [username])

  useEffect(() => {
    let filtered = [...userResults]

    if (timeFrame !== "all") {
      const now = new Date()
      const cutoff = new Date()

      if (timeFrame === "week") {
        cutoff.setDate(now.getDate() - 7)
      } else if (timeFrame === "month") {
        cutoff.setMonth(now.getMonth() - 1)
      }

      filtered = filtered.filter((result) => new Date(result.timestamp) >= cutoff)
    }

    if (gameMode !== "all") {
      filtered = filtered.filter((result) => result.mode === gameMode)
    }

    if (filtered.length > 0) {
      const completed = filtered.filter((r) => r.completed)

      const avgWpm = completed.reduce((sum, r) => sum + r.wpm, 0) / (completed.length || 1)
      setAverageWpm(Math.round(avgWpm * 10) / 10)

      const max = completed.reduce((max, r) => Math.max(max, r.wpm), 0)
      setMaxWpm(Math.round(max * 10) / 10)

      const avgAccuracy = completed.reduce((sum, r) => sum + r.accuracy, 0) / (completed.length || 1)
      setAverageAccuracy(Math.round(avgAccuracy * 10) / 10)

      setTotalGames(filtered.length)
      setCompletedGames(completed.length)

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse()

      const dataByDay: Record<string, { wpm: number[]; accuracy: number[] }> = {}

      last7Days.forEach((day) => {
        dataByDay[day] = { wpm: [], accuracy: [] }
      })

      completed.forEach((result) => {
        const day = new Date(result.timestamp).toISOString().split("T")[0]
        if (dataByDay[day]) {
          dataByDay[day].wpm.push(result.wpm)
          dataByDay[day].accuracy.push(result.accuracy)
        }
      })

      const chartData = Object.entries(dataByDay).map(([day, data]) => {
        const avgWpm = data.wpm.length > 0 ? data.wpm.reduce((sum, wpm) => sum + wpm, 0) / data.wpm.length : 0

        const avgAccuracy =
          data.accuracy.length > 0 ? data.accuracy.reduce((sum, acc) => sum + acc, 0) / data.accuracy.length : 0

        return {
          day: day.split("-")[2],
          wpm: Math.round(avgWpm * 10) / 10,
          accuracy: Math.round(avgAccuracy * 10) / 10,
        }
      })

      setChartData(chartData)
    } else {
      setAverageWpm(0)
      setMaxWpm(0)
      setAverageAccuracy(0)
      setTotalGames(0)
      setCompletedGames(0)
      setChartData([])
    }
  }, [userResults, timeFrame, gameMode])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stats Tracker
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={gameMode} onValueChange={setGameMode as any}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Game Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="lava">Lava</SelectItem>
                  <SelectItem value="invisible">Invisible</SelectItem>
                  <SelectItem value="speed">Speed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFrame} onValueChange={setTimeFrame as any}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>Track your typing performance over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userResults.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No data available yet. Complete some typing games to see your stats!
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-500 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold">{averageWpm}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Avg. WPM</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-500 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold">{maxWpm}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Max WPM</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold">{averageAccuracy}%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Avg. Accuracy</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold">
                      {completedGames}/{totalGames}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Completed Games</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="wpm">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wpm">WPM Over Time</TabsTrigger>
                  <TabsTrigger value="accuracy">Accuracy Over Time</TabsTrigger>
                </TabsList>
                <TabsContent value="wpm" className="pt-4">
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="wpm" fill="#3b82f6" name="WPM" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Not enough data to display chart
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="accuracy" className="pt-4">
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="accuracy" fill="#10b981" name="Accuracy %" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Not enough data to display chart
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
