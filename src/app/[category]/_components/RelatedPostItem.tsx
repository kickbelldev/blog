import Link from 'next/link'

import { formatDate } from '@/app/_lib/formatDate'
import type { Post } from '@/domain/blog'

import { TagList } from './TagList'

export function RelatedPostItem({
  post,
}: {
  post: Pick<Post, 'slug' | 'data'>
}) {
  return (
    <Link
      key={post.slug}
      href={`/${post.data.category || 'uncategorized'}/${post.slug}`}
      className="block w-full max-w-sm"
    >
      <div className="border rounded-lg p-4 h-full duration-200">
        <div className="font-medium text-stone-900 dark:text-stone-100 line-clamp-2 mb-2">
          {post.data.title}
        </div>
        <div className="text-sm text-stone-600 dark:text-stone-400 mb-2">
          {formatDate(post.data.date)}
        </div>
        <div className="text-sm text-stone-700 dark:text-stone-300 line-clamp-3 mb-3">
          {post.data.description}
        </div>
        {post.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            <TagList tags={post.data.tags} />
          </div>
        )}
      </div>
    </Link>
  )
}
