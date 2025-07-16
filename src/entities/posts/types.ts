import type { GrayMatterFile } from 'gray-matter'

export type PostFrontMatter = {
  title: string
  date: string
  tags: Array<string>
  description?: string
  author?: string
  readingTime?: number
  featured?: boolean
}

export type Post = {
  slug: string
  content: string
  data: PostFrontMatter
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
  }
  twitter: {
    card: 'summary_large_image'
    title: string
    description: string
  }
}
