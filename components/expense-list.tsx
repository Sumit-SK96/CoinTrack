"use client"

import { useState } from "react"
import type { Expense, Filter } from "@/lib/types"
import { formatCurrency, getCategoryIcon, categoryOptions } from "@/lib/sample-data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Trash2 } from "lucide-react"

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
  filter: Filter
  setFilter: (filter: Filter) => void
  isLoading: boolean
}

export function ExpenseList({ expenses, onDelete, onEdit, filter, setFilter, isLoading }: ExpenseListProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense
    direction: "ascending" | "descending"
  }>({ key: "date", direction: "descending" })

  const handleSort = (key: keyof Expense) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const handleCategoryFilter = (category: string) => {
    setFilter({ ...filter, category })
  }

  const handleDateFilter = (dateRange: string) => {
    setFilter({ ...filter, dateRange })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <Select value={filter.category} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter.dateRange} onValueChange={handleDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <span>Total: {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</span>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  Title
                  {sortConfig.key === "title" && (
                    <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortConfig.key === "amount" && (
                    <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("category")}
                >
                  Category
                  {sortConfig.key === "category" && (
                    <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortConfig.key === "date" && (
                    <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
              ) : sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm">{expense.title}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(expense.amount)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(expense.category)}
                        <span>
                          {categoryOptions.find((c) => c.value === expense.category)?.label || expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(expense)}
                          className="h-8 w-8 transition-all hover:scale-110 active:scale-95"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(expense.id)}
                          className="h-8 w-8 text-destructive transition-all hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No expenses found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
