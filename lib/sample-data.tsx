import type { Expense } from "./types"
import { Coffee, ShoppingBag, Home, Car, Utensils, Plane, Briefcase, Heart, Shirt, Smartphone } from "lucide-react"

export const categoryOptions = [
  { value: "food", label: "Food & Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "housing", label: "Housing" },
  { value: "transportation", label: "Transportation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "travel", label: "Travel" },
  { value: "healthcare", label: "Healthcare" },
  { value: "clothing", label: "Clothing" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
]

export const sampleExpenses: Expense[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    amount: 85.75,
    category: "food",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "Monthly Rent",
    amount: 1200,
    category: "housing",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "3",
    title: "Movie Tickets",
    amount: 32.5,
    category: "entertainment",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
]

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "food":
      return <Utensils className="h-4 w-4" />
    case "shopping":
      return <ShoppingBag className="h-4 w-4" />
    case "housing":
      return <Home className="h-4 w-4" />
    case "transportation":
      return <Car className="h-4 w-4" />
    case "entertainment":
      return <Coffee className="h-4 w-4" />
    case "travel":
      return <Plane className="h-4 w-4" />
    case "healthcare":
      return <Heart className="h-4 w-4" />
    case "clothing":
      return <Shirt className="h-4 w-4" />
    case "technology":
      return <Smartphone className="h-4 w-4" />
    default:
      return <Briefcase className="h-4 w-4" />
  }
}

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "food":
      return "#FF6B6B"
    case "shopping":
      return "#4ECDC4"
    case "housing":
      return "#FFD166"
    case "transportation":
      return "#118AB2"
    case "entertainment":
      return "#9381FF"
    case "travel":
      return "#06D6A0"
    case "healthcare":
      return "#EF476F"
    case "clothing":
      return "#F78C6B"
    case "technology":
      return "#073B4C"
    default:
      return "#8D99AE"
  }
}
