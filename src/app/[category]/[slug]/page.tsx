import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { createPostMetadata } from '@/app/_lib/metadata'
import {
  PostContent,
  PostFooter,
  PostHeader,
  PostNavigation,
  RelatedPosts,
  TableOfContents,
} from '@/app/[category]/_components'
import {
  type CategoryId,
  extractHeadingsFromMDX,
  getCategoryById,
  getPostNavigation,
  getRelatedPostsByTags,
  isValidCategoryId,
  posts,
} from '@/domain/blog'

export function generateStaticParams() {
  const params = posts
    .filter((post) => post.data.category) // 카테고리가 있는 포스트만
    .map((post) => ({
      category: post.data.category as CategoryId,
      slug: encodeURIComponent(post.slug),
    }))

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string
    slug: string
  }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  // 카테고리 유효성 검증
  if (!isValidCategoryId(category)) {
    return {}
  }

  try {
    // 카테고리 기반 경로로 MDX 파일 import
    const { frontmatter } = await import(
      `@/contents/${category}/${decodedSlug}.mdx`
    )

    // 포스트의 실제 카테고리와 URL 카테고리가 일치하는지 확인
    if (frontmatter.category && frontmatter.category !== category) {
      return {}
    }

    // 포스트 데이터 찾기
    const postData = posts.find((post) => post.slug === decodedSlug)
    if (!postData) {
      return {}
    }

    // 카테고리 정보 가져오기
    const categoryInfo = getCategoryById(category)

    return createPostMetadata(postData, categoryInfo?.name)
  } catch (_error) {
    return {}
  }
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

  console.log(category, slug, decodedSlug)

  // 카테고리 유효성 검증
  if (!isValidCategoryId(category)) {
    notFound()
  }

  try {
    // 카테고리 기반 경로로 MDX 파일 import
    const { default: Post, frontmatter } = await import(
      `@/contents/${category}/${decodedSlug}.mdx`
    )

    // 포스트의 실제 카테고리와 URL 카테고리가 일치하는지 확인
    if (frontmatter.category && frontmatter.category !== category) {
      notFound()
    }

    // 포스트 콘텐츠에서 헤딩 추출 (실제 포스트 내용 필요)
    const postData = posts.find((post) => post.slug === decodedSlug)
    const headings = postData ? extractHeadingsFromMDX(postData.content) : []

    const { previousPost, nextPost } = getPostNavigation(decodedSlug)
    const relatedPosts = getRelatedPostsByTags(decodedSlug)

    return (
      <>
        <PostHeader {...frontmatter} />
        <div className="flex container mx-auto flex-col lg:flex-row">
          <div className="mx-auto px-5 py-8 max-w-5xl w-full">
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
        </div>
        <TableOfContents headings={headings} />
      </>
    )
  } catch (_error) {
    console.error(_error)
    notFound()
  }
}
