import { cn } from '@/app/_lib/cn'

interface PostContentProps {
  children: React.ReactNode
}

export function PostContent({ children }: PostContentProps) {
  return (
    <article
      className={cn(
        // Base prose styling with enhanced readability
        'prose prose-stone mx-auto',
        // Enhanced typography and spacing
        'prose-lg'
      )}
    >
      {children}
    </article>
  )
}
