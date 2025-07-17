import { cn } from '@/app/_lib/cn'
import {
  type CategoryWithCount,
  getAllCategories,
  getCategoriesWithCount,
} from '@/entities/categories'

import { CategoryBadge } from './CategoryBadge'

interface CategoryListProps {
  categories?: CategoryWithCount[]
  showCount?: boolean
  className?: string
}

export function CategoryList({
  categories,
  showCount = false,
  className,
}: CategoryListProps) {
  const displayCategories =
    categories ||
    getAllCategories().map((cat) => ({
      ...cat,
      count: 0,
    }))

  if (displayCategories.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayCategories.map((category) => (
        <div
          key={category.id}
          className="flex items-center gap-1"
        >
          <CategoryBadge categoryId={category.id} />
          {showCount && (
            <span className="text-sm text-stone-500">({category.count})</span>
          )}
        </div>
      ))}
    </div>
  )
}
