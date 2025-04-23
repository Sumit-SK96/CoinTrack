"use client"

import { useEffect, useState, useRef } from "react"
import type { Expense } from "@/lib/types"
import { formatCurrency, categoryOptions, getCategoryColor } from "@/lib/sample-data"
import { Skeleton } from "@/components/ui/skeleton"

interface PieChartProps {
  expenses: Expense[]
  isLoading: boolean
}

interface CategoryTotal {
  category: string
  total: number
  percentage: number
  color: string
}

export function PieChart({ expenses, isLoading }: PieChartProps) {
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([])
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const chartRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (isLoading) return

    // Calculate totals by category
    const totals: Record<string, number> = {}
    expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount
    })

    const grandTotal = Object.values(totals).reduce((sum, amount) => sum + amount, 0)

    // Create category totals array with percentages
    const categoryData = Object.entries(totals).map(([category, total]) => ({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      color: getCategoryColor(category),
    }))

    // Sort by total amount (descending)
    categoryData.sort((a, b) => b.total - a.total)

    setCategoryTotals(categoryData)

    // Start animation
    setAnimationProgress(0)
    const timer = setTimeout(() => {
      setAnimationProgress(1)
    }, 100)

    return () => clearTimeout(timer)
  }, [expenses, isLoading])

  const renderPieChart = () => {
    if (categoryTotals.length === 0) {
      return (
        <g>
          <text x="100" y="100" textAnchor="middle" className="text-sm fill-current">
            No data to display
          </text>
        </g>
      )
    }

    const radius = 80
    const centerX = 100
    const centerY = 100

    let startAngle = 0

    return (
      <g>
        {categoryTotals.map((category, index) => {
          // Calculate angles for pie slice
          const angle = (category.percentage / 100) * 2 * Math.PI * animationProgress
          const endAngle = startAngle + angle

          // Calculate path for pie slice
          const x1 = centerX + radius * Math.cos(startAngle)
          const y1 = centerY + radius * Math.sin(startAngle)
          const x2 = centerX + radius * Math.cos(endAngle)
          const y2 = centerY + radius * Math.sin(endAngle)

          // Determine if the slice is large (> 180 degrees)
          const largeArcFlag = angle > Math.PI ? 1 : 0

          // Create path
          const path = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ")

          // Store current angle as next start angle
          const currentStartAngle = startAngle
          startAngle = endAngle

          return (
            <path
              key={category.category}
              d={path}
              fill={category.color}
              stroke="white"
              strokeWidth="1"
              onMouseEnter={() => setHoveredCategory(category.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="transition-opacity duration-200"
              style={{
                opacity: hoveredCategory === null || hoveredCategory === category.category ? 1 : 0.6,
                transition: "all 0.3s ease",
              }}
            />
          )
        })}
      </g>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
        <div className="space-y-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <svg ref={chartRef} viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto mx-auto">
          {renderPieChart()}
        </svg>

        {categoryTotals.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-sm font-medium">Total</p>
            <p className="text-xl font-bold">
              {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {categoryTotals.map((category) => (
          <div
            key={category.category}
            className="flex items-center justify-between py-1 px-2 rounded-md transition-colors hover:bg-muted/50"
            onMouseEnter={() => setHoveredCategory(category.category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: category.color }} />
              <span className="text-sm">
                {categoryOptions.find((c) => c.value === category.category)?.label || category.category}
              </span>
            </div>
            <div className="text-sm font-medium">
              {formatCurrency(category.total)} ({category.percentage.toFixed(1)}%)
            </div>
          </div>
        ))}

        {categoryTotals.length === 0 && (
          <div className="text-center text-muted-foreground py-4">No expense data to display</div>
        )}
      </div>
    </div>
  )
}
