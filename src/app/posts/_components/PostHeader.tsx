import { Badge } from '@/app/_components/ui/badge'
import { cn } from '@/app/_lib/cn'
import { formatDate } from '@/app/_lib/formatDate'

interface PostHeaderProps {
  title: string
  date: string
  tags: string[]
  readingTime?: number
  author?: string
  className?: string
}

export function PostHeader({
  title,
  date,
  tags,
  readingTime,
  author,
  className,
}: PostHeaderProps) {
  return (
    <header
      className={cn(
        'mb-8 pb-8 border-b border-stone-200 dark:border-stone-700',
        className
      )}
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4 leading-tight">
        {title}
      </h1>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-stone-600 dark:text-stone-400">
        <time
          dateTime={date}
          className="text-sm font-medium"
          title={`작성일: ${formatDate(date)}`}
        >
          {formatDate(date)}
        </time>
        {readingTime && (
          <span className="text-sm">약 {readingTime}분 읽기</span>
        )}
        {author && <span className="text-sm">작성자: {author}</span>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
