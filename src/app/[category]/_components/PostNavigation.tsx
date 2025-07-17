import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/app/_lib/cn'
import { formatDate } from '@/app/_lib/formatDate'
import type { Post } from '@/entities/posts/types'

interface PostNavigationProps {
  previousPost?: Pick<Post, 'slug' | 'data'>
  nextPost?: Pick<Post, 'slug' | 'data'>
  className?: string
}

export function PostNavigation({
  previousPost,
  nextPost,
  className,
}: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav
      className={cn('flex justify-between items-center gap-4', className)}
      aria-label="포스트 탐색"
    >
      <div className="flex-1 max-w-[calc(50%-0.5rem)]">
        {previousPost && (
          <Link
            href={`/${previousPost.data.category || 'uncategorized'}/${previousPost.slug}`}
            className={cn(
              'flex items-center gap-2 p-3 rounded-lg w-full',
              'transition-colors duration-200',
              'hover:bg-stone-100 dark:hover:bg-stone-800',
              'focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2',
              'focus:bg-stone-100 dark:focus:bg-stone-800',
              'min-h-11 min-w-11' // Touch target size
            )}
            aria-label={`이전 포스트로 이동: ${previousPost.data.title}`}
          >
            <ChevronLeft
              className="h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-stone-600 dark:text-stone-400">
                이전글
              </div>
              <div className="font-medium text-stone-900 dark:text-stone-100 truncate">
                {previousPost.data.title}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-500">
                {formatDate(previousPost.data.date)}
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 flex justify-end max-w-[calc(50%-0.5rem)]">
        {nextPost && (
          <Link
            href={`/${nextPost.data.category || 'uncategorized'}/${nextPost.slug}`}
            className={cn(
              'flex items-center gap-2 p-3 rounded-lg text-right w-full',
              'transition-colors duration-200',
              'hover:bg-stone-100 dark:hover:bg-stone-800',
              'focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2',
              'focus:bg-stone-100 dark:focus:bg-stone-800',
              'min-h-11 min-w-11' // Touch target size
            )}
            aria-label={`다음 포스트로 이동: ${nextPost.data.title}`}
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm text-stone-600 dark:text-stone-400">
                다음글
              </div>
              <div className="font-medium text-stone-900 dark:text-stone-100 truncate">
                {nextPost.data.title}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-500">
                {formatDate(nextPost.data.date)}
              </div>
            </div>
            <ChevronRight
              className="h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </nav>
  )
}
