import type { GrayMatterFile } from 'gray-matter'

export type PostFrontMatter = {
  title: string
  date: string
  tags: Array<string>
}

export type Post = {
  slug: string
  content: string
  data: PostFrontMatter
}

export type PostGrayMatter = GrayMatterFile<string> & {
  data: PostFrontMatter
}
