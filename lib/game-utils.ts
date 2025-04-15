export function calculateWPM(text: string, timeMs: number): number {
  const words = text.length / 5
  const minutes = timeMs / 60000

  return Math.round((words / minutes) * 10) / 10
}

export function calculateAccuracy(text: string, errors: number): number {
  if (text.length === 0) return 100

  const accuracy = Math.max(0, 100 - (errors / text.length) * 100)
  return Math.round(accuracy * 10) / 10
}
