'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/app/_lib/cn'
import type { Heading } from '@/domain/blog'

interface TableOfContentsProps {
  headings: Heading[]
  className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 가장 위에 있는 헤딩을 찾아서 활성화
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -80px 0px', // 헤더 높이 고려
        threshold: 0.5,
      }
    )

    // 모든 헤딩 요소 관찰 시작
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [
    headings,
  ])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className={cn('sticky top-8', className)}>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
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
          목차
        </h3>
        <div className="max-h-96 overflow-y-auto">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  type="button"
                  onClick={() => handleClick(heading.id)}
                  className={cn(
                    'block w-full text-left text-sm transition-all duration-200 rounded px-2 py-1',
                    'hover:text-foreground hover:bg-muted/50',
                    // 헤딩 레벨에 따른 들여쓰기 및 크기
                    heading.level === 1 && 'ml-0 font-medium',
                    heading.level === 2 && 'ml-3 text-sm',
                    heading.level === 3 && 'ml-6 text-xs',
                    heading.level === 4 && 'ml-9 text-xs',
                    heading.level === 5 && 'ml-12 text-xs',
                    heading.level === 6 && 'ml-15 text-xs',
                    // 활성 상태 스타일
                    activeId === heading.id
                      ? 'text-primary font-medium bg-primary/10 border-l-2 border-primary'
                      : 'text-muted-foreground border-l-2 border-transparent'
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
