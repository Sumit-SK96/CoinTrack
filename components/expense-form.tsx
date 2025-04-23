"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Expense } from "@/lib/types"
import { categoryOptions } from "@/lib/sample-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void
  initialExpense: Expense | null
}

export function ExpenseForm({ onSubmit, initialExpense }: ExpenseFormProps) {
  const [expense, setExpense] = useState<Expense>({
    id: "",
    title: "",
    amount: 0,
    category: "food",
    date: new Date().toISOString().split("T")[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form when initialExpense changes (for editing)
  useEffect(() => {
    if (initialExpense) {
      setExpense(initialExpense)
    } else {
      // Reset form
      setExpense({
        id: "",
        title: "",
        amount: 0,
        category: "food",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [initialExpense])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    }))

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setExpense((prev) => ({ ...prev, category: value }))
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!expense.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (expense.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    if (!expense.date) {
      newErrors.date = "Date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(expense)

      // Only reset if not editing
      if (!initialExpense) {
        setExpense({
          id: "",
          title: "",
          amount: 0,
          category: "food",
          date: new Date().toISOString().split("T")[0],
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={expense.title}
            onChange={handleChange}
            placeholder="Expense title"
            className={`transition-all ${errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={expense.amount || ""}
            onChange={handleChange}
            placeholder="0.00"
            className={`transition-all ${errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={expense.category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={expense.date}
            onChange={handleChange}
            className={`transition-all ${errors.date ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]">
        {initialExpense ? "Update Expense" : "Add Expense"}
      </Button>
    </form>
  )
}
