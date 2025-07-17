import { cn } from '@/app/_lib/cn'
import type { Post } from '@/entities/posts/types'

import { RelatedPostItem } from './RelatedPostItem'

interface RelatedPostsProps {
  posts: Array<Pick<Post, 'slug' | 'data'>>
  className?: string
}

export function RelatedPosts({ posts, className }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">관련 포스트</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <RelatedPostItem
            key={post.slug}
            post={post}
          />
        ))}
      </div>
    </div>
  )
}
