import { cn } from '@/app/_lib/cn'

interface PostFooterProps {
  author?: string
  className?: string
}

export function PostFooter({ author, className }: PostFooterProps) {
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
