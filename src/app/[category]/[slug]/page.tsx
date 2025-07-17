import { notFound } from 'next/navigation'

import {
  PostContent,
  PostFooter,
  PostHeader,
  PostNavigation,
  RelatedPosts,
} from '@/app/[category]/_components'
import { type CategoryId, isValidCategoryId } from '@/entities/categories'
import { getAllPosts, getPostNavigation } from '@/entities/posts'
import { getRelatedPostsByTags } from '@/entities/tags'

export async function generateStaticParams() {
  const posts = await getAllPosts()

  const params = posts
    .filter((post) => post.data.category) // 카테고리가 있는 포스트만
    .map((post) => ({
      category: post.data.category as CategoryId,
      slug: encodeURIComponent(post.slug),
    }))

  return params
}

export default async function PostPage({
  params,
}: {
  params: Promise<{
    category: string
    slug: string
  }>
}) {
  const { category, slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  // 카테고리 유효성 검증
  if (!isValidCategoryId(category)) {
    notFound()
  }

  try {
    // 카테고리 기반 경로로 MDX 파일 import
    const { default: Post, frontmatter } = await import(
      `@/contents/${category}/${decodedSlug}`
    )

    // 포스트의 실제 카테고리와 URL 카테고리가 일치하는지 확인
    if (frontmatter.category && frontmatter.category !== category) {
      notFound()
    }

    const { previousPost, nextPost } = await getPostNavigation(decodedSlug)
    const relatedPosts = await getRelatedPostsByTags(decodedSlug)

    return (
      <div className="mx-auto px-5 py-8 max-w-4xl">
        <PostHeader {...frontmatter} />
        <PostContent>
          <Post />
        </PostContent>
        <PostFooter />
        <PostNavigation
          previousPost={previousPost}
          nextPost={nextPost}
        />
        <RelatedPosts posts={relatedPosts} />
      </div>
    )
  } catch (_error) {
    console.error(_error)
    notFound()
  }
}
