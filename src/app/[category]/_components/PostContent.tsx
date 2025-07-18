import { cn } from '@/app/_lib/cn'
import type { Heading } from '@/domain/blog'

interface PostContentProps {
  children: React.ReactNode
  showTOC?: boolean
  headings?: Heading[]
  className?: string
}

export function PostContent({
  children,
  showTOC = false,
  headings,
  className,
}: PostContentProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-4 gap-8', className)}>
      {showTOC && headings && (
        <aside className="lg:col-span-1">
          {/* TODO: Implement TableOfContents component */}
          <div className="text-sm text-stone-600">Table of Contents (TODO)</div>
        </aside>
      )}
      <article
        className={cn(
          // Base prose styling with enhanced readability
          'prose prose-stone max-w-none',
          // Enhanced typography and spacing
          'prose-lg',
          showTOC ? 'lg:col-span-3' : 'lg:col-span-4'
        )}
      >
        {children}
      </article>
    </div>
  )
}
