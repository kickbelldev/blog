import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

import {
  filterMdxFiles,
  findAdjacentPosts,
  parsePostData,
  sortPostsByDate,
} from './logic'
import type { Post, PostGrayMatter } from './types'

const postsDirectory = join(process.cwd(), 'src', 'contents')

export async function getPostFileNames() {
  const files = await readdir(postsDirectory)
  return filterMdxFiles(files)
}

export async function getPostByFileName(fileName: string) {
  const fullPath = join(postsDirectory, fileName)
  const content = await readFile(fullPath, 'utf-8')
  const parsed = matter(content) as PostGrayMatter
  return parsePostData(parsed, fileName, fullPath)
}

/**
 * 모든 MDX 파일을 재귀적으로 찾습니다 (서브디렉토리 포함).
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
 * 경로와 파일명으로 포스트를 가져옵니다.
 */
export async function getPostByFilePath(
  filePath: string,
  fileName: string
): Promise<Post> {
  const content = await readFile(filePath, 'utf-8')
  const parsed = matter(content) as PostGrayMatter
  return parsePostData(parsed, fileName, filePath)
}

const allPosts = await getAllPosts()

export async function getAllPosts() {
  const mdxFiles = await getAllMdxFiles()
  const postPromises = mdxFiles.map(({ filePath, fileName }) =>
    getPostByFilePath(filePath, fileName)
  )
  const posts = await Promise.all(postPromises)
  return sortPostsByDate(posts)
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  return allPosts.filter((post) => post.data.tags.includes(tag))
}

export async function getPostNavigation(currentSlug: string) {
  return findAdjacentPosts(allPosts, currentSlug)
}

/**
 * 슬러그로 포스트를 가져옵니다.
 */
export function getPostBySlug(slug: string): Post | null {
  return allPosts.find((post) => post.slug === slug) || null
}

export default allPosts
