"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import { sampleExpenses } from "@/lib/sample-data"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if user already exists
      if (users.some((user: any) => user.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      }

      // Add user to users array
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Set current user
      localStorage.setItem("currentUser", JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }))

      // Initialize expenses for the new user
      localStorage.setItem(`expenses_${newUser.id}`, JSON.stringify(sampleExpenses))

      toast({
        title: "Success!",
        description: "Your account has been created.",
      })

      router.push("/dashboard")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-12 w-12" />
          <h1 className="mt-4 text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">Sign up for CoinTrack to start tracking your expenses</p>
        </div>

        <div className="backdrop-blur-sm bg-card/80 border rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
