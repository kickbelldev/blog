import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 mt-auto">
      <div className="container mx-auto px-5 py-6">
        {/* 3컬럼 구조 - 모바일에서는 1컬럼 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm mb-2">
              [Site Name]
            </h3>
            <p className="text-sm text-stone-600">[Site Description]</p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 text-sm mb-2">
              Contact
            </h4>
            <p className="text-sm text-stone-600">
              <Link
                href="mailto:kickbelldev@gmail.com"
                className="hover:text-stone-900 transition-colors"
              >
                Email
              </Link>
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 text-sm mb-2">Links</h4>
            <div className="flex gap-4 md:flex-col md:gap-0 md:space-y-1">
              {/* TODO: RSS 추가 */}
              <Link
                href="https://github.com/kickbelldev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-4 pt-3">
          <div className="text-center">
            <p className="text-sm text-stone-500">
              © {new Date().getFullYear()} [Site Name]. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
