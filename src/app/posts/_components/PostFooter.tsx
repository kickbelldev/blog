import { cn } from '@/app/_lib/cn'
import type { Post } from '@/entities/posts/types'

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
    <footer className={cn('mt-12 pt-8 border-t border-stone-200', className)}>
      {/* TODO: Implement PostNavigation component */}
      {(previousPost || nextPost) && (
        <div className="mb-8">
          <div className="text-sm text-stone-600">Navigation (TODO)</div>
        </div>
      )}

      {/* TODO: Implement RelatedPosts component */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mb-8">
          <div className="text-sm text-stone-600">Related Posts (TODO)</div>
        </div>
      )}

      {/* TODO: Implement SocialShare component */}
      <div className="mb-8">
        <div className="text-sm text-stone-600">Social Share (TODO)</div>
      </div>

      {/* TODO: Implement AuthorInfo component */}
      {author && (
        <div className="mb-8">
          <div className="text-sm text-stone-600">
            Author Info: {author} (TODO)
          </div>
        </div>
      )}
    </footer>
  )
}
