import { cn } from '@/app/_lib/cn'
import type { Post } from '@/entities/posts/types'

import { PostNavigation } from './PostNavigation'
import { RelatedPosts } from './RelatedPosts'

interface PostFooterProps {
  previousPost?: Pick<Post, 'slug' | 'data'>
  nextPost?: Pick<Post, 'slug' | 'data'>
  relatedPosts?: Array<Pick<Post, 'slug' | 'data'>>
  author?: string
  className?: string
}

export function PostFooter({
  previousPost,
  nextPost,
  relatedPosts,
  author,
  className,
}: PostFooterProps) {
  return (
    <footer className={cn('pt-8', className)}>
      {/* TODO: Implement AuthorInfo */}
      {/* TODO: Implement SocialShare with window.navigator.share */}
      <div className="mb-8">
        <div className="text-sm text-stone-600">Social Share (TODO)</div>
      </div>
    </footer>
  )
}
