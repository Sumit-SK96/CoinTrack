"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = localStorage.getItem("currentUser")

    if (!currentUser && pathname !== "/sign-in" && pathname !== "/sign-up") {
      router.push("/sign-in")
    } else {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/80">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  )
}
