import Link from 'next/link'

import { getCategoriesWithCount } from '@/domain/blog'

import NavLink from './NavLink'

export default function Header() {
  const categories = getCategoriesWithCount()

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="container mx-auto px-5 h-14 flex items-center gap-x-6">
        <Link
          href="/"
          className="text-xl font-bold text-stone-900 hover:text-stone-700 transition-colors"
        >
          DevBlog
        </Link>

        <div className="flex items-center space-x-6">
          {categories.map((category) => (
            <NavLink
              key={category.id}
              href={`/${category.id}`}
            >
              {category.name}
            </NavLink>
          ))}
          <NavLink href="/tags">Tags</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>
      </nav>
    </header>
  )
}
