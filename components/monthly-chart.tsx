"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Expense } from "@/lib/types"
import { formatCurrency } from "@/lib/sample-data"
import { Skeleton } from "@/components/ui/skeleton"

interface MonthlyChartProps {
  expenses: Expense[]
  year: number
  isLoading: boolean
}

interface MonthData {
  name: string
  total: number
}

export function MonthlyChart({ expenses, year, isLoading }: MonthlyChartProps) {
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([])

  useEffect(() => {
    if (isLoading) return

    // Initialize data for all months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const initialData = months.map((name) => ({ name, total: 0 }))

    // Filter expenses for the selected year and aggregate by month
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === year
    })

    // Calculate total for each month
    filteredExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      const monthIndex = expenseDate.getMonth()
      initialData[monthIndex].total += expense.amount
    })

    setMonthlyData(initialData)
  }, [expenses, year, isLoading])

  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis tickFormatter={(value) => formatCurrency(value).split(".")[0]} className="text-xs" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="total" name="Total Spent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
