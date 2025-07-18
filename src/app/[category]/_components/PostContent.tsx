import { cn } from '@/app/_lib/cn'
import type { Heading } from '@/domain/blog'

import { TableOfContents } from './TableOfContents'

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
    <>
      {/* 모바일 TOC - 펼침/접기 가능한 형태 */}
      {showTOC && headings && headings.length > 0 && (
        <div className="lg:hidden mb-6">
          <TableOfContents
            headings={headings}
            className="relative"
          />
        </div>
      )}

      {/* 데스크톱 레이아웃 */}
      <div className={cn('grid grid-cols-1 lg:grid-cols-4 gap-8', className)}>
        {/* 데스크톱 TOC - 사이드바 */}
        {showTOC && headings && headings.length > 0 && (
          <aside className="hidden lg:block lg:col-span-1">
            <TableOfContents headings={headings} />
          </aside>
        )}

        <article
          className={cn(
            // Base prose styling with enhanced readability
            'prose prose-stone max-w-none',
            // Enhanced typography and spacing
            'prose-lg',
            showTOC && headings && headings.length > 0
              ? 'lg:col-span-3'
              : 'lg:col-span-4'
          )}
        >
          {children}
        </article>
      </div>
    </>
  )
}
