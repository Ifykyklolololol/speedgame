"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MoonStar, Sun, Settings, Trophy, BarChart3, Medal, Flame } from "lucide-react"
import { useTheme } from "next-themes"
import GameArea from "@/components/game-area"
import Leaderboard from "@/components/leaderboard"
import Achievements from "@/components/achievements"
import StatsTracker from "@/components/stats-tracker"
import CustomizationPanel from "@/components/customization-panel"

export default function GameLayout() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("game")
  const [username, setUsername] = useState("")
  const [showUsernameModal, setShowUsernameModal] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Ensure proper viewport settings for mobile
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      const meta = document.createElement("meta")
      meta.name = "viewport"
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      document.head.appendChild(meta)
    }

    const storedUsername = localStorage.getItem("typeracer-username")
    if (storedUsername) {
      setUsername(JSON.parse(storedUsername))
    } else {
      setShowUsernameModal(true)
    }
  }, [])

  const saveUsername = (name) => {
    setUsername(name)
    localStorage.setItem("typeracer-username", JSON.stringify(name))
    setShowUsernameModal(false)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Relix Type Racer</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="game" className="flex items-center justify-center gap-1 px-1 sm:px-3">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Game</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center justify-center gap-1 px-1 sm:px-3">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center justify-center gap-1 px-1 sm:px-3">
              <Medal className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center justify-center gap-1 px-1 sm:px-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center justify-center gap-1 px-1 sm:px-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Customize</span>
            </TabsTrigger>
          </TabsList>

          <div>
            <TabsContent value="game" className="mt-0">
              <GameArea username={username} />
            </TabsContent>
            <TabsContent value="leaderboard" className="mt-0">
              <Leaderboard username={username} />
            </TabsContent>
            <TabsContent value="achievements" className="mt-0">
              <Achievements username={username} />
            </TabsContent>
            <TabsContent value="stats" className="mt-0">
              <StatsTracker username={username} />
            </TabsContent>
            <TabsContent value="customize" className="mt-0">
              <CustomizationPanel />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <footer className="border-t py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Relix Type Racer. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowUsernameModal(true)}>
              {username ? `Playing as: ${username}` : "Set Username"}
            </Button>
          </div>
        </div>
      </footer>

      {showUsernameModal && (
        <UsernameModal
          currentUsername={username}
          onSave={saveUsername}
          onClose={() => {
            if (username) setShowUsernameModal(false)
          }}
        />
      )}
    </div>
  )
}

function UsernameModal({ currentUsername, onSave, onClose }) {
  const [name, setName] = useState(currentUsername || "")

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Enter Your Username</h2>
        <p className="text-muted-foreground mb-4">
          Choose a username to track your progress and appear on leaderboards.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YourCoolUsername"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            {currentUsername && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button onClick={() => onSave(name)} disabled={!name.trim()}>
              Save & Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
