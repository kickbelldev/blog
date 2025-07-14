import Link from 'next/link'

export default function Header() {
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
          <Link
            href="/tags"
            className="text-stone-500 hover:text-stone-900 transition-colors"
          >
            Tags
          </Link>
          <Link
            href="/about"
            className="text-stone-500 hover:text-stone-900 transition-colors"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
