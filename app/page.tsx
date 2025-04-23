"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = localStorage.getItem("currentUser")

    if (currentUser) {
      router.push("/dashboard")
    } else {
      router.push("/sign-in")
    }
  }, [router])

  return null
}
