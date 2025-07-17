import { author } from '@/constants'

import type { Post, PostGrayMatter } from './types'

/**
 * 파일 이름 목록에서 .mdx 파일만 필터링합니다.
 */
export function filterMdxFiles(files: string[]): string[] {
  return files.filter((file) => file.endsWith('.mdx'))
}

/**
 * 파싱된 데이터를 Post 객체로 변환합니다.
 */
export function parsePostData(
  parsed: PostGrayMatter,
  fileName: string,
  filePath?: string
): Post {
  // 디렉토리 경로에서 카테고리 추론
  const category = filePath ? extractCategoryFromPath(filePath) : undefined

  return {
    content: parsed.content,
    data: {
      ...parsed.data,
      // frontmatter에 category가 없으면 디렉토리에서 추론
      category: parsed.data.category || category,
    },
    slug: fileName.replace(/\.mdx$/, ''),
    author: author,
  }
}

/**
 * 파일 경로에서 카테고리를 추론합니다.
 */
export function extractCategoryFromPath(filePath: string): string | undefined {
  const pathSegments = filePath.split('/')
  const contentsIndex = pathSegments.findIndex(
    (segment) => segment === 'contents'
  )

  if (contentsIndex === -1 || contentsIndex >= pathSegments.length - 2) {
    return undefined
  }

  const categorySegment = pathSegments[contentsIndex + 1]

  // 파일명이 아닌 디렉토리인지 확인 (최소 2단계 deeper: contents/category/file.mdx)
  if (contentsIndex + 2 < pathSegments.length) {
    return categorySegment
  }

  return undefined
}

/**
 * 포스트 목록을 날짜순으로 정렬합니다 (최신순).
 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return posts.toSorted((post1, post2) =>
    new Date(post1.data.date) > new Date(post2.data.date) ? -1 : 1
  )
}

/**
 * 특정 태그를 가진 포스트들을 필터링합니다.
 */
export function filterPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.data.tags.includes(tag))
}

/**
 * 현재 포스트를 기준으로 이전/다음 포스트를 찾습니다.
 * 날짜 순으로 정렬된 포스트 목록에서 현재 포스트의 위치를 찾아 이전/다음 포스트를 반환합니다.
 */
export function findAdjacentPosts(
  posts: Post[],
  currentSlug: string
): {
  previousPost?: Pick<Post, 'slug' | 'data'>
  nextPost?: Pick<Post, 'slug' | 'data'>
} {
  const sortedPosts = sortPostsByDate(posts)
  const currentIndex = sortedPosts.findIndex(
    (post) => post.slug === currentSlug
  )

  if (currentIndex === -1) {
    return {}
  }

  const previousPost =
    currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined
  const nextPost =
    currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : undefined

  return {
    previousPost: previousPost
      ? {
          slug: previousPost.slug,
          data: previousPost.data,
        }
      : undefined,
    nextPost: nextPost
      ? {
          slug: nextPost.slug,
          data: nextPost.data,
        }
      : undefined,
  }
}
