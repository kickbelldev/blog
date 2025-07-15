import { describe, expect, it } from 'vitest'

import {
  filterMdxFiles,
  filterPostsByTag,
  parsePostData,
  sortPostsByDate,
} from './logic'
import type { Post, PostGrayMatter } from './types'

describe('Posts Logic - Business Logic Tests', () => {
  describe('filterMdxFiles', () => {
    it('should return only .mdx files', () => {
      const files = [
        'post1.mdx',
        'post2.mdx',
        'README.md',
        'config.json',
        'post3.mdx',
      ]

      const result = filterMdxFiles(files)

      expect(result).toEqual([
        'post1.mdx',
        'post2.mdx',
        'post3.mdx',
      ])
    })

    it('should return empty array when no .mdx files', () => {
      const files = [
        'README.md',
        'config.json',
      ]

      const result = filterMdxFiles(files)

      expect(result).toEqual([])
    })

    it('should handle empty array', () => {
      const result = filterMdxFiles([])
      expect(result).toEqual([])
    })
  })

  describe('parsePostData', () => {
    it('should convert parsed data to Post object correctly', () => {
      const parsedData: PostGrayMatter = {
        content: '# Test Content\n\nThis is a test post.',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
            'example',
          ],
        },
        excerpt: '',
        orig: Buffer.from('test'),
        language: '',
        matter: '',
        stringify: () => '',
      }

      const result = parsePostData(parsedData, 'test-post.mdx')

      expect(result).toEqual({
        slug: 'test-post',
        content: '# Test Content\n\nThis is a test post.',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
            'example',
          ],
        },
      })
    })

    it('should extract slug from filename correctly', () => {
      const parsedData: PostGrayMatter = {
        content: 'Content',
        data: {
          title: 'Title',
          date: '2025-01-01',
          tags: [],
        },
        excerpt: '',
        orig: Buffer.from('test'),
        language: '',
        matter: '',
        stringify: () => '',
      }

      const result = parsePostData(parsedData, 'my-awesome-post.mdx')

      expect(result.slug).toBe('my-awesome-post')
    })

    it('should handle empty content and data', () => {
      const parsedData: PostGrayMatter = {
        content: '',
        data: {
          title: '',
          date: '',
          tags: [],
        },
        excerpt: '',
        orig: Buffer.from(''),
        language: '',
        matter: '',
        stringify: () => '',
      }

      const result = parsePostData(parsedData, 'empty.mdx')

      expect(result).toEqual({
        slug: 'empty',
        content: '',
        data: {
          title: '',
          date: '',
          tags: [],
        },
      })
    })
  })

  describe('sortPostsByDate', () => {
    it('should sort posts by date (newest first)', () => {
      const posts: Post[] = [
        {
          slug: 'old-post',
          content: 'Old content',
          data: {
            title: 'Old Post',
            date: '2025-01-01',
            tags: [],
          },
        },
        {
          slug: 'new-post',
          content: 'New content',
          data: {
            title: 'New Post',
            date: '2025-01-03',
            tags: [],
          },
        },
        {
          slug: 'middle-post',
          content: 'Middle content',
          data: {
            title: 'Middle Post',
            date: '2025-01-02',
            tags: [],
          },
        },
      ]

      const result = sortPostsByDate(posts)

      expect(result[0].data.title).toBe('New Post')
      expect(result[1].data.title).toBe('Middle Post')
      expect(result[2].data.title).toBe('Old Post')
    })

    it('should handle posts with same date', () => {
      const posts: Post[] = [
        {
          slug: 'post-a',
          content: 'Content A',
          data: {
            title: 'Post A',
            date: '2025-01-01',
            tags: [],
          },
        },
        {
          slug: 'post-b',
          content: 'Content B',
          data: {
            title: 'Post B',
            date: '2025-01-01',
            tags: [],
          },
        },
      ]

      const result = sortPostsByDate(posts)

      expect(result).toHaveLength(2)
      // Should maintain stable sort order
      expect(result.map((p) => p.data.title)).toEqual([
        'Post A',
        'Post B',
      ])
    })

    it('should handle invalid date format gracefully', () => {
      const posts: Post[] = [
        {
          slug: 'invalid-date',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: 'invalid-date',
            tags: [],
          },
        },
        {
          slug: 'valid-date',
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-01',
            tags: [],
          },
        },
      ]

      const result = sortPostsByDate(posts)

      expect(result).toHaveLength(2)
      // Should handle invalid date gracefully - both posts should be returned
      expect(result.map((p) => p.data.title)).toContain('Post 1')
      expect(result.map((p) => p.data.title)).toContain('Post 2')
    })

    it('should handle empty array', () => {
      const result = sortPostsByDate([])
      expect(result).toEqual([])
    })
  })

  describe('filterPostsByTag', () => {
    const posts: Post[] = [
      {
        slug: 'react-post',
        content: 'React content',
        data: {
          title: 'React Post',
          date: '2025-01-01',
          tags: [
            'React',
            'JavaScript',
          ],
        },
      },
      {
        slug: 'vue-post',
        content: 'Vue content',
        data: {
          title: 'Vue Post',
          date: '2025-01-02',
          tags: [
            'Vue',
            'JavaScript',
          ],
        },
      },
      {
        slug: 'python-post',
        content: 'Python content',
        data: {
          title: 'Python Post',
          date: '2025-01-03',
          tags: [
            'Python',
          ],
        },
      },
    ]

    it('should filter posts by tag', () => {
      const result = filterPostsByTag(posts, 'JavaScript')

      expect(result).toHaveLength(2)
      expect(result.map((p) => p.data.title)).toEqual([
        'React Post',
        'Vue Post',
      ])
    })

    it('should return empty array for non-existent tag', () => {
      const result = filterPostsByTag(posts, 'NonExistent')

      expect(result).toEqual([])
    })

    it('should handle empty posts array', () => {
      const result = filterPostsByTag([], 'React')

      expect(result).toEqual([])
    })
  })
})
