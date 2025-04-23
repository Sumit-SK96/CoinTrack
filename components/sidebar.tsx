"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, CreditCard, Home, LogOut, Menu, Settings, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/sign-in")
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Expenses", href: "/expenses", icon: CreditCard },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 transform bg-background/80 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full w-64 flex-col bg-card shadow-xl">
          <div className="flex items-center justify-between p-4">
            <Logo className="h-8 w-8" />
            <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={closeMobileMenu}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {user && (
            <div className="border-t p-4">
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r bg-card md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <Logo className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">CoinTrack</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {user && (
            <div className="border-t p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
