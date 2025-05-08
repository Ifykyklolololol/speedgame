"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Paintbrush, Palette, Volume2, VolumeX, Settings, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

const themes = ["light", "dark", "system"]
const colors = [
  { name: "blue", value: "#3b82f6", hsl: "217.2 91.2% 59.8%" },
  { name: "green", value: "#10b981", hsl: "162.2 84.1% 39.2%" },
  { name: "purple", value: "#8b5cf6", hsl: "262.1 83.3% 57.8%" },
  { name: "pink", value: "#ec4899", hsl: "331.3 94.5% 58.8%" },
  { name: "orange", value: "#f97316", hsl: "24.6 95% 53.1%" },
  { name: "red", value: "#ef4444", hsl: "0 84.2% 60.2%" },
]

export default function CustomizationPanel() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(80)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [accentColor, setAccentColor] = useState("blue")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSound = localStorage.getItem("typeracer-sound-enabled")
      const storedVolume = localStorage.getItem("typeracer-sound-volume")
      const storedAnimations = localStorage.getItem("typeracer-animations-enabled")
      const storedSpeed = localStorage.getItem("typeracer-animation-speed")
      const storedColor = localStorage.getItem("typeracer-accent-color")

      if (storedSound !== null) setSoundEnabled(JSON.parse(storedSound))
      if (storedVolume !== null) setSoundVolume(JSON.parse(storedVolume))
      if (storedAnimations !== null) setAnimationsEnabled(JSON.parse(storedAnimations))
      if (storedSpeed !== null) setAnimationSpeed(JSON.parse(storedSpeed))
      if (storedColor !== null) setAccentColor(JSON.parse(storedColor))
    }

    setMounted(true)
  }, [])

  const saveSettings = (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  useEffect(() => {
    if (mounted) {
      const selectedColor = colors.find((c) => c.name === accentColor)

      if (selectedColor) {
        document.documentElement.style.setProperty("--primary", selectedColor.hsl)
        document.documentElement.style.setProperty("--ring", selectedColor.hsl)
      }
    }
  }, [accentColor, mounted])

  const handleSoundToggle = (value) => {
    setSoundEnabled(value)
    saveSettings("typeracer-sound-enabled", value)
  }

  const handleVolumeChange = (value) => {
    setSoundVolume(value[0])
    saveSettings("typeracer-sound-volume", value[0])
  }

  const handleAnimationsToggle = (value) => {
    setAnimationsEnabled(value)
    saveSettings("typeracer-animations-enabled", value)
  }

  const handleSpeedChange = (value) => {
    setAnimationSpeed(value[0])
    saveSettings("typeracer-animation-speed", value[0])
  }

  const handleColorChange = (colorName) => {
    setAccentColor(colorName)
    saveSettings("typeracer-accent-color", colorName)
  }

  if (!mounted) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Your Experience
          </CardTitle>
          <CardDescription>Personalize the game to match your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theme">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Theme</span>
              </TabsTrigger>
              <TabsTrigger value="sound" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Sound</span>
              </TabsTrigger>
              <TabsTrigger value="animations" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Animations</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="space-y-6 pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme Selection</h3>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <Button
                      key={t}
                      variant={theme === t ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-16 sm:h-24 gap-1 sm:gap-2 px-1 sm:px-3"
                      onClick={() => setTheme(t)}
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                          t === "light"
                            ? "bg-white border"
                            : t === "dark"
                              ? "bg-slate-900"
                              : "bg-gradient-to-r from-white to-slate-900"
                        }`}
                      >
                        {t === "light" && <span className="text-black text-base sm:text-xl">☀️</span>}
                        {t === "dark" && <span className="text-white text-base sm:text-xl">🌙</span>}
                        {t === "system" && <span className="text-base sm:text-xl">⚙️</span>}
                      </div>
                      <span className="capitalize text-xs sm:text-base">{t}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accent Color</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-full h-10 sm:h-12 rounded-md flex items-center justify-center ${
                        accentColor === color.name ? "ring-2 ring-offset-2 ring-offset-background" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(color.name)}
                      aria-label={`Set accent color to ${color.name}`}
                    >
                      {accentColor === color.name && <Paintbrush className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sound" className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-medium">Sound Effects</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable sound effects during gameplay</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={handleSoundToggle} />
                    <Label htmlFor="sound-toggle">
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sound-volume">Volume</Label>
                    <span className="text-sm text-muted-foreground">{soundVolume}%</span>
                  </div>
                  <Slider
                    id="sound-volume"
                    disabled={!soundEnabled}
                    value={[soundVolume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="animations" className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-medium">Animations</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable animations throughout the app</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="animations-toggle"
                      checked={animationsEnabled}
                      onCheckedChange={handleAnimationsToggle}
                    />
                    <Label htmlFor="animations-toggle">
                      {animationsEnabled ? <Sparkles className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="animation-speed">Animation Speed</Label>
                    <span className="text-sm text-muted-foreground">
                      {animationSpeed === 0.5 ? "Slow" : animationSpeed === 1 ? "Normal" : "Fast"}
                    </span>
                  </div>
                  <Slider
                    id="animation-speed"
                    disabled={!animationsEnabled}
                    value={[animationSpeed]}
                    onValueChange={handleSpeedChange}
                    min={0.5}
                    max={2}
                    step={0.5}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
