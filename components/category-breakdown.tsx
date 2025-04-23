"use client"

import { useEffect, useState } from "react"
import type { Expense } from "@/lib/types"
import { formatCurrency, getCategoryIcon, categoryOptions } from "@/lib/sample-data"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryBreakdownProps {
  expenses: Expense[]
  year: number
  isLoading: boolean
}

interface CategoryData {
  category: string
  total: number
  percentage: number
}

export function CategoryBreakdown({ expenses, year, isLoading }: CategoryBreakdownProps) {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    if (isLoading) return

    // Filter expenses for the selected year
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === year
    })

    // Calculate totals by category
    const categoryTotals: Record<string, number> = {}
    filteredExpenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    setTotalSpent(total)

    // Create category data array with percentages
    const data = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
      percentage: total > 0 && total > 0 ? (total / total) * 100 : 0,
    }))

    // Sort by total amount (descending)
    data.sort((a, b) => b.total - a.total)

    setCategoryData(data)
  }, [expenses, year, isLoading])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
      </div>
    )
  }

  if (categoryData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-center text-muted-foreground">
        No expense data available for {year}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Total Spent in {year}</h3>
        <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
      </div>

      <div className="space-y-6">
        {categoryData.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(item.category)}
                <span className="font-medium">
                  {categoryOptions.find((c) => c.value === item.category)?.label || item.category}
                </span>
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(item.total)} ({((item.total / totalSpent) * 100).toFixed(1)}%)
              </div>
            </div>
            <Progress value={(item.total / totalSpent) * 100} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
