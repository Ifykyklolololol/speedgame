"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Medal, Trophy, Zap, Flame, Eye, Award, Star } from "lucide-react"
import { getAllGameResults } from "@/lib/game-storage"
import type { GameResult } from "@/lib/types"

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  condition: (results: GameResult[]) => boolean
  progress: (results: GameResult[]) => number
  maxProgress: number
}

export default function Achievements({ username }: { username: string }) {
  const [userResults, setUserResults] = useState<GameResult[]>([])

  useEffect(() => {
    const results = getAllGameResults().filter((result) => result.username === username)
    setUserResults(results)
  }, [username])

  const achievements: Achievement[] = [
    {
      id: "first_game",
      name: "First Steps",
      description: "Complete your first typing game",
      icon: <Award className="h-6 w-6 text-green-500" />,
      condition: (results) => results.length > 0,
      progress: (results) => Math.min(results.length, 1),
      maxProgress: 1,
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Reach 60+ WPM in any game mode",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      condition: (results) => results.some((r) => r.wpm >= 60),
      progress: (results) => {
        const maxWpm = results.reduce((max, r) => Math.max(max, r.wpm), 0)
        return Math.min(maxWpm, 60)
      },
      maxProgress: 60,
    },
    {
      id: "perfect_accuracy",
      name: "Perfectionist",
      description: "Complete a game with 100% accuracy",
      icon: <Star className="h-6 w-6 text-purple-500" />,
      condition: (results) => results.some((r) => r.accuracy === 100),
      progress: (results) => {
        const maxAccuracy = results.reduce((max, r) => Math.max(max, r.accuracy), 0)
        return maxAccuracy
      },
      maxProgress: 100,
    },
    {
      id: "lava_master",
      name: "Lava Master",
      description: "Complete 5 games in Lava mode",
      icon: <Flame className="h-6 w-6 text-red-500" />,
      condition: (results) => results.filter((r) => r.mode === "lava" && r.completed).length >= 5,
      progress: (results) => results.filter((r) => r.mode === "lava" && r.completed).length,
      maxProgress: 5,
    },
    {
      id: "invisible_ninja",
      name: "Invisible Ninja",
      description: "Complete 3 games in Invisible mode",
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      condition: (results) => results.filter((r) => r.mode === "invisible" && r.completed).length >= 3,
      progress: (results) => results.filter((r) => r.mode === "invisible" && r.completed).length,
      maxProgress: 3,
    },
    {
      id: "speed_runner",
      name: "Speed Runner",
      description: "Complete 3 games in Speed mode",
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      condition: (results) => results.filter((r) => r.mode === "speed" && r.completed).length >= 3,
      progress: (results) => results.filter((r) => r.mode === "speed" && r.completed).length,
      maxProgress: 3,
    },
    {
      id: "all_rounder",
      name: "All-Rounder",
      description: "Complete at least one game in each mode",
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      condition: (results) => {
        const modes = ["classic", "lava", "invisible", "speed"]
        return modes.every((mode) => results.some((r) => r.mode === mode && r.completed))
      },
      progress: (results) => {
        const modes = ["classic", "lava", "invisible", "speed"]
        return modes.filter((mode) => results.some((r) => r.mode === mode && r.completed)).length
      },
      maxProgress: 4,
    },
    {
      id: "marathon_typer",
      name: "Marathon Typer",
      description: "Complete 10 games in any mode",
      icon: <Award className="h-6 w-6 text-indigo-500" />,
      condition: (results) => results.filter((r) => r.completed).length >= 10,
      progress: (results) => Math.min(results.filter((r) => r.completed).length, 10),
      maxProgress: 10,
    },
    {
      id: "hard_mode",
      name: "Challenge Accepted",
      description: "Complete a game on Hard difficulty",
      icon: <Star className="h-6 w-6 text-red-500" />,
      condition: (results) => results.some((r) => r.difficulty === "hard" && r.completed),
      progress: (results) => (results.some((r) => r.difficulty === "hard" && r.completed) ? 1 : 0),
      maxProgress: 1,
    },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Track your progress and unlock achievements as you improve your typing skills!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement, index) => {
              const isUnlocked = achievement.condition(userResults)
              const progressValue = achievement.progress(userResults)
              const progressPercent = (progressValue / achievement.maxProgress) * 100

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden ${isUnlocked ? "border-primary" : "border-muted"}`}>
                    <div className={`h-1 ${isUnlocked ? "bg-primary" : "bg-muted"}`} />
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${isUnlocked ? "bg-primary/10" : "bg-muted"}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{achievement.name}</h3>
                            {isUnlocked && <Trophy className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <div className="pt-2">
                            <Progress value={progressPercent} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>
                                {progressValue} / {achievement.maxProgress}
                              </span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
