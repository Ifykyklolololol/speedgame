"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal } from "lucide-react"
import type { GameMode, GameResult } from "@/lib/types"
import { getAllGameResults } from "@/lib/game-storage"

export default function Leaderboard({ username }: { username: string }) {
  const [leaderboardData, setLeaderboardData] = useState<GameResult[]>([])
  const [filteredData, setFilteredData] = useState<GameResult[]>([])
  const [gameMode, setGameMode] = useState<GameMode>("classic")
  const [timeFrame, setTimeFrame] = useState<"all" | "day" | "week" | "month">("all")
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")

  useEffect(() => {
    const results = getAllGameResults()
    setLeaderboardData(results)
  }, [])

  useEffect(() => {
    let filtered = [...leaderboardData]

    if (gameMode !== "all") {
      filtered = filtered.filter((result) => result.mode === gameMode)
    }

    if (timeFrame !== "all") {
      const now = new Date()
      const cutoff = new Date()

      if (timeFrame === "day") {
        cutoff.setDate(now.getDate() - 1)
      } else if (timeFrame === "week") {
        cutoff.setDate(now.getDate() - 7)
      } else if (timeFrame === "month") {
        cutoff.setMonth(now.getMonth() - 1)
      }

      filtered = filtered.filter((result) => new Date(result.timestamp) >= cutoff)
    }

    if (difficulty !== "all") {
      filtered = filtered.filter((result) => result.difficulty === difficulty)
    }

    filtered = filtered.filter((result) => result.completed)

    filtered.sort((a, b) => b.wpm - a.wpm)

    filtered = filtered.slice(0, 10)

    setFilteredData(filtered)
  }, [leaderboardData, gameMode, timeFrame, difficulty])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
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
                  <SelectItem value="day">Last 24h</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficulty} onValueChange={setDifficulty as any}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>See who has the fastest fingers in the game!</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No data available for the selected filters. Try changing your selection.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 py-2 font-medium">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-center">WPM</div>
                <div className="col-span-2 text-center">Accuracy</div>
                <div className="col-span-3 text-center">Date</div>
              </div>

              {filteredData.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-3 sm:grid-cols-12 gap-2 sm:gap-4 p-3 rounded-md ${
                    result.username === username ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-center items-center">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                    {index === 2 && <Medal className="h-5 w-5 text-amber-700" />}
                    {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                  </div>
                  <div className="col-span-2 sm:col-span-4 flex items-center">
                    <span className="truncate">{result.username || "Anonymous"}</span>
                    {result.username === username && (
                      <Badge variant="outline" className="ml-2 hidden sm:inline-flex">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="hidden sm:block sm:col-span-2 text-center">{result.wpm.toFixed(1)}</div>
                  <div className="hidden sm:block sm:col-span-2 text-center">{result.accuracy.toFixed(1)}%</div>
                  <div className="hidden sm:block sm:col-span-3 text-center text-muted-foreground">
                    {new Date(result.timestamp).toLocaleDateString()}
                  </div>

                  {/* Mobile-only summary */}
                  <div className="col-span-3 sm:hidden grid grid-cols-2 gap-2 text-sm mt-1">
                    <div>
                      WPM: <span className="font-medium">{result.wpm.toFixed(1)}</span>
                    </div>
                    <div>
                      Acc: <span className="font-medium">{result.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="col-span-2 text-muted-foreground">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
