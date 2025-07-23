'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

import { cn } from '../_lib/cn'

interface NavLinkProps extends ComponentProps<typeof Link> {}

export default function NavLink({ href, children, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={cn(
        'text-stone-500 hover:text-stone-900 transition-colors',
        active && 'text-stone-900'
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
