import Link from 'next/link'
import type { ComponentProps } from 'react'

interface NavLinkProps extends ComponentProps<typeof Link> {}

export default function NavLink({ href, children, ...props }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-stone-500 hover:text-stone-900 transition-colors"
      {...props}
    >
      {children}
    </Link>
  )
}
