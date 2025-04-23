export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

export interface Filter {
  category: string
  dateRange: string
}
