"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthlyChart } from "@/components/monthly-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"
import type { Expense } from "@/lib/types"

export default function ReportsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [availableYears, setAvailableYears] = useState<string[]>([])

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

      // Get available years from expenses
      const years = [
        ...new Set(parsedExpenses.map((expense: Expense) => new Date(expense.date).getFullYear().toString())),
      ]
      setAvailableYears(years.length > 0 ? years : [new Date().getFullYear().toString()])
    }

    setIsLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="category">Category Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>Your spending trends throughout {year}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <MonthlyChart expenses={expenses} year={Number.parseInt(year)} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="category" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Your spending by category in {year}</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown expenses={expenses} year={Number.parseInt(year)} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
