"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Get current user
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setName(userData.name)
      setEmail(userData.email)
    }

    // Get theme preference
    const theme = localStorage.getItem("theme")
    setDarkMode(theme === "dark")
  }, [])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Update user data
    const updatedUser = { ...user, name, email }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, name, email } : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked)
    localStorage.setItem("theme", checked ? "dark" : "light")

    // Update document class for theme
    if (checked) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    toast({
      title: "Theme updated",
      description: `Theme set to ${checked ? "dark" : "light"} mode.`,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="transition-all hover:scale-[1.02] active:scale-[0.98]">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications about your expenses</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch id="theme" checked={darkMode} onCheckedChange={handleThemeChange} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
