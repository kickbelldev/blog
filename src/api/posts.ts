import { readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter, { type GrayMatterFile } from 'gray-matter'

const postsDirectory = join(process.cwd(), 'src', 'contents')

export function getPostSlugs() {
  return readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'))
}

interface Post extends GrayMatterFile<string> {
  date: string
  title: string
  slug: string
  content: string
}

export async function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.mdx`)
  const fileContents = await readFile(fullPath, 'utf-8')

  return Object.assign(matter(fileContents), {
    slug: realSlug,
  }) as Post
}

export async function getAllPosts() {
  const slugs = getPostSlugs()
  const postPromises = slugs.map((slug) => getPostBySlug(slug))
  const posts = await Promise.all(postPromises)
  return posts.toSorted((post1, post2) => (post1.date > post2.date ? -1 : 1))
}
