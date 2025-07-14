import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

import type { Post } from './types'

const postsDirectory = join(process.cwd(), 'src', 'contents')

export async function getPostFileNames() {
  const files = await readdir(postsDirectory)
  return files.filter((file) => file.endsWith('.mdx'))
}

export async function getPostByFileName(fileName: string) {
  const fullPath = join(postsDirectory, fileName)
  const fileContents = matter(await readFile(fullPath, 'utf-8')) as Post

  return Object.assign(fileContents, {
    slug: fileName.replace(/\.mdx$/, ''),
  })
}

export async function getAllPosts() {
  const fileNames = await getPostFileNames()
  const postPromises = fileNames.map((fileName) => getPostByFileName(fileName))
  const posts = await Promise.all(postPromises)
  return posts.toSorted((post1, post2) =>
    new Date(post1.data.date) > new Date(post2.data.date) ? -1 : 1
  )
}
