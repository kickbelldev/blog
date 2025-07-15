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
export function parsePostData(parsed: PostGrayMatter, fileName: string): Post {
  return {
    content: parsed.content,
    data: parsed.data,
    slug: fileName.replace(/\.mdx$/, ''),
  }
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
