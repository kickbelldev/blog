import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  categories,
  getCategoryById,
  getPostsByCategory,
  isValidCategoryId,
} from '@/domain/blog'

import { CategoryBadge } from './_components/CategoryBadge'

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    category: string
  }>
}) {
  const { category } = await params

  if (!isValidCategoryId(category)) {
    notFound()
  }

  const categoryInfo = getCategoryById(category)
  const categoryPosts = getPostsByCategory(category)

  if (!categoryInfo) {
    notFound()
  }

  return (
    <div className="mx-auto px-5 py-8 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge categoryId={category} />
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {categoryInfo.name}
          </h1>
        </div>
        {categoryInfo.description && (
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            {categoryInfo.description}
          </p>
        )}
        <p className="text-stone-500 dark:text-stone-500 text-sm mt-2">
          {categoryPosts.length}개의 포스트
        </p>
      </header>

      <div className="space-y-6">
        {categoryPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-500 dark:text-stone-500">
              아직 이 카테고리에 포스트가 없습니다.
            </p>
          </div>
        ) : (
          categoryPosts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-stone-200 dark:border-stone-700 pb-6 last:border-b-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <time className="text-sm text-stone-500 dark:text-stone-500">
                  {new Date(post.data.date).toLocaleDateString('ko-KR')}
                </time>
              </div>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                <Link
                  href={`/${post.data.category || category}/${post.slug}`}
                  className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  {post.data.title}
                </Link>
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-3">
                {post.data.description}
              </p>
              {post.data.tags && post.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
