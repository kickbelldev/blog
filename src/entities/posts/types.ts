import type { GrayMatterFile } from 'gray-matter'

export interface Post extends GrayMatterFile<string> {
  slug: string
  data: {
    date: string
    title: string
    tags: Array<string>
  }
}
