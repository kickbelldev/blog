import { cn } from '@/app/_lib/cn'
import type { Heading } from '@/entities/posts/types'

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
          'prose-lg md:prose-xl',
          'prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-stone-100',
          'prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0',
          'prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6',
          'prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4',
          'prose-h4:text-lg md:prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3',
          // Enhanced paragraph and text styling
          'prose-p:text-stone-700 dark:prose-p:text-stone-300',
          'prose-p:leading-relaxed prose-p:mb-6',
          // Enhanced link styling
          'prose-a:text-stone-900 dark:prose-a:text-stone-100',
          'prose-a:font-medium prose-a:no-underline',
          'prose-a:border-b prose-a:border-stone-300 dark:prose-a:border-stone-600',
          'hover:prose-a:border-stone-500 dark:hover:prose-a:border-stone-400',
          'prose-a:transition-colors',
          // Enhanced list styling
          'prose-ul:my-6 prose-ol:my-6',
          'prose-li:my-2 prose-li:text-stone-700 dark:prose-li:text-stone-300',
          // Enhanced blockquote styling
          'prose-blockquote:border-l-4 prose-blockquote:border-stone-300 dark:prose-blockquote:border-stone-600',
          'prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-stone-800/50',
          'prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8',
          'prose-blockquote:text-stone-700 dark:prose-blockquote:text-stone-300',
          'prose-blockquote:italic prose-blockquote:font-medium',
          // Enhanced code styling
          'prose-code:text-stone-900 dark:prose-code:text-stone-100',
          'prose-code:bg-stone-100 dark:prose-code:bg-stone-800',
          'prose-code:px-2 prose-code:py-1 prose-code:rounded-md',
          'prose-code:text-sm prose-code:font-mono',
          'prose-code:before:content-none prose-code:after:content-none',
          // Enhanced pre/code block styling
          'prose-pre:bg-stone-900 dark:prose-pre:bg-stone-950',
          'prose-pre:border prose-pre:border-stone-200 dark:prose-pre:border-stone-700',
          'prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8',
          'prose-pre:overflow-x-auto prose-pre:text-sm',
          // Mobile-specific code block improvements
          'prose-pre:max-w-full prose-pre:scrollbar-thin',
          'prose-pre:scrollbar-track-stone-100 prose-pre:scrollbar-thumb-stone-300',
          'dark:prose-pre:scrollbar-track-stone-800 dark:prose-pre:scrollbar-thumb-stone-600',
          // Enhanced image styling
          'prose-img:rounded-lg prose-img:shadow-lg',
          'prose-img:my-8 prose-img:mx-auto',
          'prose-img:max-w-full prose-img:h-auto',
          // Enhanced table styling
          'prose-table:my-8 prose-table:w-full',
          'prose-thead:bg-stone-50 dark:prose-thead:bg-stone-800',
          'prose-th:text-stone-900 dark:prose-th:text-stone-100',
          'prose-th:font-semibold prose-th:text-left',
          'prose-td:text-stone-700 dark:prose-td:text-stone-300',
          'prose-tr:border-b prose-tr:border-stone-200 dark:prose-tr:border-stone-700',
          // Enhanced hr styling
          'prose-hr:border-stone-200 dark:prose-hr:border-stone-700',
          'prose-hr:my-12',
          // Enhanced strong/em styling
          'prose-strong:text-stone-900 dark:prose-strong:text-stone-100',
          'prose-strong:font-semibold',
          'prose-em:text-stone-800 dark:prose-em:text-stone-200',
          showTOC ? 'lg:col-span-3' : 'lg:col-span-4'
        )}
      >
        {children}
      </article>
    </div>
  )
}
