"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, Eye, Zap, Award } from "lucide-react"
import { getRandomText } from "@/lib/text-samples"
import { saveGameResult } from "@/lib/game-storage"
import { calculateWPM, calculateAccuracy } from "@/lib/game-utils"

const GAME_MODES = {
  classic: {
    name: "Classic Mode",
    description: "Type the text as fast as you can!",
    icon: <Award className="h-4 w-4" />,
  },
  lava: {
    name: "Lava Mode",
    description: "Type before the lava reaches the top!",
    icon: <Flame className="h-4 w-4 text-red-500" />,
  },
  invisible: {
    name: "Invisible Mode",
    description: "The text will disappear after 3 seconds!",
    icon: <Eye className="h-4 w-4" />,
  },
  speed: {
    name: "Speed Mode",
    description: "Words move faster as you type!",
    icon: <Zap className="h-4 w-4 text-yellow-500" />,
  },
}

export default function GameArea({ username }: { username: string }) {
  const [gameMode, setGameMode] = useState("classic")
  const [gameState, setGameState] = useState("ready")
  const [difficulty, setDifficulty] = useState("medium")

  const [text, setText] = useState("")
  const [input, setInput] = useState("")
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [errors, setErrors] = useState(0)
  const [progress, setProgress] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)

  const [lavaHeight, setLavaHeight] = useState(0)
  const [visibleLetters, setVisibleLetters] = useState(true)

  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const gameTimerRef = useRef(null)

  const startGame = () => {
    const newText = getRandomText(difficulty)
    setText(newText)
    setInput("")
    setGameState("playing")
    setErrors(0)
    setProgress(0)
    setLavaHeight(0)
    setVisibleLetters(true)

    const now = Date.now()
    setStartTime(now)
    setElapsedTime(0)

    const gameStartTime = now

    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000))
    }, 1000)

    if (gameMode === "lava") {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current)
      }

      gameTimerRef.current = setInterval(() => {
        setLavaHeight((prev) => {
          const newHeight = prev + 0.5
          if (newHeight >= 100) {
            endGame(false)
            return 100
          }
          return newHeight
        })
      }, 500)
    } else if (gameMode === "invisible") {
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current)
      }

      gameTimerRef.current = setTimeout(() => {
        setVisibleLetters(false)
      }, 3000)
    }
  }

  const endGame = (completed = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current)
      gameTimerRef.current = null
    }

    setGameState("finished")

    const endTime = Date.now()
    const finalWpm = calculateWPM(text, endTime - startTime)
    const finalAccuracy = calculateAccuracy(text, errors)

    setWpm(finalWpm)
    setAccuracy(finalAccuracy)

    const finalElapsedTime = Math.floor((endTime - startTime) / 1000)
    setElapsedTime(finalElapsedTime)

    const result = {
      mode: gameMode,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors,
      text,
      timestamp: new Date().toISOString(),
      completed,
      difficulty,
      username,
    }

    saveGameResult(username, result)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)

    const newProgress = Math.min(100, Math.floor((value.length / text.length) * 100))
    setProgress(newProgress)

    let errorCount = 0
    for (let i = 0; i < value.length; i++) {
      if (i < text.length && value[i] !== text[i]) {
        errorCount++
      }
    }
    setErrors(errorCount)

    if (value.length === text.length && errorCount === 0) {
      endGame(true)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (gameTimerRef.current) clearInterval(gameTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (gameState === "playing") {
      if (timerRef.current) clearInterval(timerRef.current)
      if (gameTimerRef.current) clearInterval(gameTimerRef.current)
      setGameState("ready")
    }
  }, [gameMode, difficulty])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Relix Type Racer</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gameMode} onValueChange={setGameMode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Game Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Classic</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lava">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-red-500" />
                      <span>Lava</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="invisible">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Invisible</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="speed">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Speed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>{GAME_MODES[gameMode]?.description || "Type the text as fast as you can!"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameState === "ready" && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Badge variant="outline" className="px-4 py-2 text-lg font-semibold">
                {GAME_MODES[gameMode]?.name || "Classic Mode"}
              </Badge>
              <Button size="lg" onClick={startGame}>
                Start Typing
              </Button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="relative space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{elapsedTime}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Errors: {errors}</span>
                </div>
              </div>

              <div
                className={`p-4 rounded-md border ${
                  gameMode === "lava" ? "border-red-500" : "border-border"
                } relative overflow-hidden`}
              >
                {visibleLetters && (
                  <div className="text-lg leading-relaxed font-mono">
                    {text.split("").map((char, index) => {
                      let color = "text-muted-foreground"
                      if (index < input.length) {
                        color = input[index] === char ? "text-green-500" : "text-red-500"
                      }
                      return (
                        <span key={index} className={color}>
                          {char}
                        </span>
                      )
                    })}
                  </div>
                )}

                {gameMode === "lava" && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-red-500"
                    style={{ height: `${lavaHeight}%` }}
                  />
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {gameState === "finished" && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">
                  {wpm > 60 ? "Impressive!" : wpm > 40 ? "Well done!" : "Good effort!"}
                </h3>
                <p className="text-muted-foreground">
                  {accuracy > 95
                    ? "Amazing accuracy!"
                    : accuracy > 85
                      ? "Good accuracy!"
                      : "Keep practicing for better accuracy."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{wpm}</div>
                  <div className="text-sm text-muted-foreground">Words Per Minute</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{elapsedTime}s</div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={startGame}>Play Again</Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {gameMode === "classic" && "Classic: Standard typing race"}
            {gameMode === "lava" && "Lava: Race against rising lava"}
            {gameMode === "invisible" && "Invisible: Text disappears after 3 seconds"}
            {gameMode === "speed" && "Speed: Words move faster as you type"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
