import { cn } from '@/app/_lib/cn'
import { type CategoryId, getCategoryById } from '@/entities/categories'

interface CategoryBadgeProps {
  categoryId: CategoryId
  className?: string
  showIcon?: boolean
}

export async function CategoryBadge({
  categoryId,
  className,
  showIcon = true,
}: CategoryBadgeProps) {
  const category = await getCategoryById(categoryId)

  if (!category) {
    return null
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    red: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    yellow:
      'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    purple:
      'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md border transition-colors',
        colorClasses[category.color as keyof typeof colorClasses] ||
          colorClasses.gray,
        className
      )}
      title={category.description}
    >
      {showIcon && category.icon && (
        <span
          className="text-xs"
          aria-hidden="true"
        >
          {category.icon}
        </span>
      )}
      {category.name}
    </span>
  )
}
