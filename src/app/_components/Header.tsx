import Link from 'next/link'

import { getCategoriesWithCount } from '@/entities/categories'
import { getAllPosts } from '@/entities/posts'

import NavLink from './NavLink'

export default async function Header() {
  const posts = await getAllPosts()
  const categories = await getCategoriesWithCount(posts)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="container mx-auto px-5 h-14 flex items-center gap-x-6">
        <Link
          href="/"
          className="text-xl font-bold text-stone-900"
        >
          [Site Brand]
        </Link>

        <div className="flex items-center space-x-6">
          {categories.map((category) => (
            <NavLink
              key={category.id}
              href={`/categories/${category.id}`}
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
