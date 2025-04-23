"use client"

import { useEffect, useState } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import type { Expense, Filter } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/pie-chart"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filter, setFilter] = useState<Filter>({ category: "all", dateRange: "all" })
  const [isLoading, setIsLoading] = useState(true)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get current user
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const user = JSON.parse(currentUser)
    setUserId(user.id)

    // Load expenses for the current user
    const userExpenses = localStorage.getItem(`expenses_${user.id}`) || localStorage.getItem("expenses")
    if (userExpenses) {
      setExpenses(JSON.parse(userExpenses))
    }

    setIsLoading(false)
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && userId) {
      localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses))
    }
  }, [expenses, isLoading, userId])

  const addExpense = (expense: Expense) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)))
      setEditingExpense(null)
    } else {
      // Add new expense with unique ID
      const newExpense = {
        ...expense,
        id: Date.now().toString(),
        date: expense.date || new Date().toISOString().split("T")[0],
      }
      setExpenses([newExpense, ...expenses])
    }
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const startEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const filteredExpenses = expenses.filter((expense) => {
    // Filter by category
    if (filter.category !== "all" && expense.category !== filter.category) {
      return false
    }

    // Filter by date range
    if (filter.dateRange !== "all") {
      const expenseDate = new Date(expense.date)
      const today = new Date()

      if (filter.dateRange === "thisWeek") {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        if (expenseDate < weekStart) return false
      } else if (filter.dateRange === "thisMonth") {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        if (expenseDate < monthStart) return false
      }
    }

    return true
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Expenses</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
              <CardDescription>Record a new expense or edit an existing one</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm onSubmit={addExpense} initialExpense={editingExpense} />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>View and manage your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseList
                expenses={filteredExpenses}
                onDelete={deleteExpense}
                onEdit={startEditExpense}
                filter={filter}
                setFilter={setFilter}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border shadow-lg transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Your spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <PieChart expenses={filteredExpenses} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
