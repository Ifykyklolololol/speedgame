import type { Metadata } from "next"
import GameLayout from "@/components/game-layout"

export const metadata: Metadata = {
  title: "Relix Type Racer",
  description: "Type Racer Made By RelixEnd NO AI ALL BRAIN POWER",
}

export default function HomePage() {
  return <GameLayout />
}
