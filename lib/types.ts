export type GameMode = "classic" | "lava" | "invisible" | "speed"

export interface GameResult {
  mode: GameMode
  wpm: number
  accuracy: number
  errors: number
  text: string
  timestamp: string
  completed: boolean
  difficulty: string
  username?: string
}
