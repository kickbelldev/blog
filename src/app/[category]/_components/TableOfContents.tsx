import Link from 'next/link'

import { cn } from '@/app/_lib/cn'
import type { Heading } from '@/domain/blog'

interface TableOfContentsProps {
  headings: Heading[]
  className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null
  }

  return (
    <nav className={cn('fixed top-14 bottom-0 right-0', className)}>
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="목차 아이콘"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          On this post
        </h3>
        <div className="overflow-y-auto">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    'block w-full text-left text-sm transition-all duration-200 rounded px-2 py-1',
                    'hover:text-foreground hover:bg-muted/50',
                    // 헤딩 레벨에 따른 들여쓰기 및 크기
                    heading.level === 1 && 'ml-0 font-medium',
                    heading.level === 2 && 'ml-3 text-sm',
                    heading.level === 3 && 'ml-6 text-xs',
                    heading.level === 4 && 'ml-9 text-xs',
                    heading.level === 5 && 'ml-12 text-xs',
                    heading.level === 6 && 'ml-15 text-xs'
                  )}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
