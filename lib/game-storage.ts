import type { GameResult } from "./types"

export function saveGameResult(username: string, result: GameResult): void {
  if (typeof window === "undefined") return

  const resultWithUsername = {
    ...result,
    username,
  }

  const existingResults = getAllGameResults()

  const updatedResults = [...existingResults, resultWithUsername]

  try {
    localStorage.setItem("typeracer-results", JSON.stringify(updatedResults))
  } catch (error) {
    console.error("Error saving game results:", error)
  }
}

export function getAllGameResults(): GameResult[] {
  if (typeof window === "undefined") return []

  try {
    const resultsJson = localStorage.getItem("typeracer-results")
    if (resultsJson) {
      return JSON.parse(resultsJson)
    }
  } catch (error) {
    console.error("Error parsing game results:", error)
  }

  return []
}

export function getUserGameResults(username: string): GameResult[] {
  const allResults = getAllGameResults()
  return allResults.filter((result) => result.username === username)
}

export function clearAllGameResults(): void {
  localStorage.removeItem("typeracer-results")
}
