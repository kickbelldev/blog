import type { Metadata } from 'next'
import Link from 'next/link'

import { formatDate } from '@/app/_lib/formatDate'
import { createHomeMetadata } from '@/app/_lib/metadata'
import {
  allPosts,
  allTags,
  getCategoriesWithCount,
  type Post,
} from '@/domain/blog'

export const metadata: Metadata = createHomeMetadata()

export default function Home() {
  const categories = getCategoriesWithCount()
  const recentPosts = allPosts.slice(0, 6)
  const popularTags = allTags.slice(0, 10)

  return (
    <div className="mx-auto px-5 py-8 max-w-6xl">
      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">카테고리</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.id}`}
              className="group p-6 border border-stone-200 rounded-lg hover:border-stone-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-stone-900 group-hover:text-stone-700">
                  {category.name}
                </h3>
                <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded">
                  {category.count}개
                </span>
              </div>
              {category.description && (
                <p className="text-stone-600 text-sm">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-900">최근 포스트</h2>
          <Link
            href="/posts"
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
            />
          ))}
        </div>
      </section>

      {/* Popular Tags Section */}
      <section>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">인기 태그</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags?tag=${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              {tag.name}
              <span className="text-xs text-stone-500">({tag.count})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/${post.data.category || 'uncategorized'}/${post.slug}`}
      className="group block p-6 border border-stone-200 rounded-lg hover:border-stone-300 hover:shadow-md transition-all"
    >
      <div className="mb-2">
        <time className="text-sm text-stone-500">
          {formatDate(post.data.date)}
        </time>
      </div>
      <h3 className="text-lg font-semibold text-stone-900 group-hover:text-stone-700 mb-2 line-clamp-2">
        {post.data.title}
      </h3>
      <p className="text-stone-600 text-sm mb-3 line-clamp-3">
        {post.data.description}
      </p>
      {post.data.tags && post.data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.data.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-600 rounded"
            >
              {tag}
            </span>
          ))}
          {post.data.tags.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium text-stone-500">
              +{post.data.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
