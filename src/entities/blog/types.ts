import type { UndirectedGraph } from 'graphology'
import type { GrayMatterFile } from 'gray-matter'

// ===== Post Types =====
export type PostFrontMatter = {
  title: string
  date: string
  tags: Array<string>
  description: string
  category?: CategoryId
}

export type Post = {
  slug: string
  content: string
  author: string
  data: PostFrontMatter
  readingTime?: number
}

export type PostGrayMatter = GrayMatterFile<string> & {
  data: PostFrontMatter
}

export type PostWithNavigation = Post & {
  previousPost?: Pick<Post, 'slug' | 'data'>
  nextPost?: Pick<Post, 'slug' | 'data'>
  relatedPosts?: Array<Pick<Post, 'slug' | 'data'>>
}

export type Heading = {
  id: string
  text: string
  level: number
}

export type PostMetadata = {
  title: string
  description: string
  openGraph: {
    title: string
    description: string
    type: 'article'
    publishedTime: string
    authors: string[]
    tags: string[]
    section?: string
  }
  twitter: {
    card: 'summary_large_image'
    title: string
    description: string
  }
}

// ===== Category Types =====
export type CategoryId = string

export type Category = {
  id: CategoryId
  name: string
  description?: string
  color?: string
  icon?: string
}

export type CategoryWithCount = Category & {
  count: number
}

// ===== Tag Types =====
export type Tag = {
  name: string
  count: number
  posts: string[]
}

export type TagNodeAttributes = {
  name: string
  count: number
  weight: number
  posts: string[]
}

export type TagEdgeAttributes = {
  weight: number
  cooccurrence: number
}

export type TagRelationship = {
  tag: string
  relatedTags: Array<{
    name: string
    cooccurrence: number
    similarity: number
  }>
}

export type TagCluster = {
  id: string
  name: string
  tags: string[]
  centrality: number
}

export type TagGraph = UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>
