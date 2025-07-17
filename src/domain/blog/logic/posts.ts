import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

import { author } from '@/constants'

import type { Post, PostGrayMatter } from '../types'

const postsDirectory = join(process.cwd(), 'src', 'contents')

/**
 * 파일 이름 목록에서 .mdx 파일만 필터링
 */
export function filterMdxFiles(files: string[]): string[] {
  return files.filter((file) => file.endsWith('.mdx'))
}

/**
 * 파싱된 데이터를 Post 객체로 변환
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
 * 파일 경로에서 카테고리 추론
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
 * 포스트 목록을 날짜순으로 정렬 (최신순)
 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return posts.toSorted((post1, post2) =>
    new Date(post1.data.date) > new Date(post2.data.date) ? -1 : 1
  )
}

/**
 * 특정 태그를 가진 포스트 필터링
 */
export function filterPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.data.tags.includes(tag))
}

/**
 * 현재 포스트를 기준으로 이전/다음 포스트 찾기
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

/**
 * 모든 MDX 파일을 재귀적으로 찾음 (서브디렉토리 포함)
 */
export async function getAllMdxFiles(dir: string = postsDirectory): Promise<
  Array<{
    filePath: string
    fileName: string
  }>
> {
  const files: Array<{
    filePath: string
    fileName: string
  }> = []
  const entries = await readdir(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stats = await stat(fullPath)

    if (stats.isDirectory()) {
      // 서브디렉토리가 있으면 재귀적으로 스캔
      const subFiles = await getAllMdxFiles(fullPath)
      files.push(...subFiles)
    } else if (entry.endsWith('.mdx')) {
      files.push({
        filePath: fullPath,
        fileName: entry,
      })
    }
  }

  return files
}

/**
 * 경로와 파일명으로 포스트 가져오기
 */
export async function getPostByFilePath(
  filePath: string,
  fileName: string
): Promise<Post> {
  const content = await readFile(filePath, 'utf-8')
  const parsed = matter(content) as PostGrayMatter
  return parsePostData(parsed, fileName, filePath)
}

/**
 * 모든 포스트 가져오기
 */
export async function getAllPosts(): Promise<Post[]> {
  const mdxFiles = await getAllMdxFiles()
  const postPromises = mdxFiles.map(({ filePath, fileName }) =>
    getPostByFilePath(filePath, fileName)
  )
  const posts = await Promise.all(postPromises)
  return sortPostsByDate(posts)
}
