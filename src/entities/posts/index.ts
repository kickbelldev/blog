import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

import { filterMdxFiles, parsePostData, sortPostsByDate } from './logic'
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
  return parsePostData(parsed, fileName)
}

export async function getAllPosts() {
  const fileNames = await getPostFileNames()
  const postPromises = fileNames.map((fileName) => getPostByFileName(fileName))
  const posts = await Promise.all(postPromises)
  return sortPostsByDate(posts)
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.data.tags.includes(tag))
}
