import { cn } from '@/app/_lib/cn'
import { formatDate } from '@/app/_lib/formatDate'
import type { CategoryId } from '@/domain/blog'

import { CategoryBadge } from './CategoryBadge'
import { TagList } from './TagList'

interface PostHeaderProps {
  title: string
  date: string
  tags: string[]
  category?: CategoryId
  readingTime?: number
  author?: string
  className?: string
}

export function PostHeader({
  title,
  date,
  tags,
  category,
  readingTime,
  author,
  className,
}: PostHeaderProps) {
  return (
    <header className={cn('mb-8 pb-8 ', className)}>
      <div className="flex items-center gap-3 mb-4">
        {category && <CategoryBadge categoryId={category} />}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
          {title}
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-stone-600 dark:text-stone-400">
        <time
          dateTime={date}
          className="text-sm font-medium"
          title={`Published on ${formatDate(date)}`}
        >
          {formatDate(date)}
        </time>
        {readingTime && <span className="text-sm">{readingTime} min read</span>}
        {author && <span className="text-sm">by {author}</span>}
        {tags.length > 0 && <TagList tags={tags} />}
      </div>
    </header>
  )
}
