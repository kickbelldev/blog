export type Category = {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
}

export type CategoryWithCount = Category & {
  count: number
}

export type CategoryId = string
