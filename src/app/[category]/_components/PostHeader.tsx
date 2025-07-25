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
}

export function PostHeader({
  title,
  date,
  tags,
  category,
  readingTime,
  author,
}: PostHeaderProps) {
  return (
    <header className="prose prose-stone">
      <div className="flex items-center gap-3 mb-4">
        {category && <CategoryBadge categoryId={category} />}
        <h1 className="leading-snug">{title}</h1>
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
