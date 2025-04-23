"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, DollarSign, TrendingUp, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/pie-chart"
import { formatCurrency, getCategoryIcon, categoryOptions } from "@/lib/sample-data"
import type { Expense } from "@/lib/types"

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSpent: 0,
    topCategory: "",
    averageExpense: 0,
    recentTransactions: [] as Expense[],
  })

  useEffect(() => {
    // Get current user
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const userId = JSON.parse(currentUser).id

    // Load expenses for the current user
    const userExpenses = localStorage.getItem(`expenses_${userId}`) || localStorage.getItem("expenses")
    if (userExpenses) {
      const parsedExpenses = JSON.parse(userExpenses)
      setExpenses(parsedExpenses)

      // Calculate stats
      const totalSpent = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0)

      // Find top category
      const categoryTotals: Record<string, number> = {}
      parsedExpenses.forEach((expense: Expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
      })

      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || ""

      // Calculate average expense
      const averageExpense = totalSpent / (parsedExpenses.length || 1)

      // Get recent transactions (last 5)
      const recentTransactions = [...parsedExpenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      setStats({
        totalSpent,
        topCategory,
        averageExpense,
        recentTransactions,
      })
    }

    setIsLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild className="transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/expenses">
            Add New Expense
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
              ) : (
                formatCurrency(stats.totalSpent)
              )}
            </div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            ) : stats.topCategory ? (
              <div className="flex items-center gap-2">
                {getCategoryIcon(stats.topCategory)}
                <div>
                  <div className="text-2xl font-bold">
                    {categoryOptions.find((c) => c.value === stats.topCategory)?.label || stats.topCategory}
                  </div>
                  <p className="text-xs text-muted-foreground">Most of your spending</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
              ) : (
                formatCurrency(stats.averageExpense)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense Breakdown */}
        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Your spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart expenses={expenses} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest expenses</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/expenses">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                      </div>
                      <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
              </div>
            ) : stats.recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{transaction.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(transaction.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">No recent transactions</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
