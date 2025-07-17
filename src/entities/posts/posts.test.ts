import { describe, expect, it } from 'vitest'

import {
  extractCategoryFromPath,
  filterMdxFiles,
  filterPostsByTag,
  findAdjacentPosts,
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
          description: 'Test Description',
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
        author: 'Kayce Kim',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          description: 'Test Description',
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
          description: 'description',
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
          description: '',
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
        author: 'Kayce Kim',
        data: {
          title: '',
          date: '',
          description: '',
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
          author: 'Old Author',
          data: {
            title: 'Old Post',
            date: '2025-01-01',
            description: '',
            tags: [],
          },
        },
        {
          slug: 'new-post',
          content: 'New content',
          author: 'New Author',
          data: {
            title: 'New Post',
            date: '2025-01-03',
            description: '',
            tags: [],
          },
        },
        {
          slug: 'middle-post',
          content: 'Middle content',
          author: 'Middle Author',
          data: {
            title: 'Middle Post',
            date: '2025-01-02',
            description: '',
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
          author: 'Author A',
          data: {
            title: 'Post A',
            date: '2025-01-01',
            description: 'Description A',
            tags: [],
          },
        },
        {
          slug: 'post-b',
          content: 'Content B',
          author: 'Author B',
          data: {
            title: 'Post B',
            date: '2025-01-01',
            description: 'Description B',
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
          author: 'Author 1',
          data: {
            title: 'Post 1',
            date: 'invalid-date',
            description: 'Description 1',
            tags: [],
          },
        },
        {
          slug: 'valid-date',
          content: 'Content 2',
          author: 'Author 2',
          data: {
            title: 'Post 2',
            date: '2025-01-01',
            description: 'Description 2',
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
        author: 'React Author',
        data: {
          title: 'React Post',
          date: '2025-01-01',
          description: 'React Description',
          tags: [
            'React',
            'JavaScript',
          ],
        },
      },
      {
        slug: 'vue-post',
        content: 'Vue content',
        author: 'Vue Author',
        data: {
          title: 'Vue Post',
          date: '2025-01-02',
          description: 'Vue Description',
          tags: [
            'Vue',
            'JavaScript',
          ],
        },
      },
      {
        slug: 'python-post',
        content: 'Python content',
        author: 'Python Author',
        data: {
          title: 'Python Post',
          date: '2025-01-03',
          description: 'Python Description',
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

  describe('extractCategoryFromPath', () => {
    it('should extract dev category from path', () => {
      const path = '/home/user/project/src/contents/dev/post.mdx'
      const result = extractCategoryFromPath(path)
      expect(result).toBe('dev')
    })

    it('should extract life category from path', () => {
      const path = '/home/user/project/src/contents/life/post.mdx'
      const result = extractCategoryFromPath(path)
      expect(result).toBe('life')
    })

    it('should return undefined for root contents directory', () => {
      const path = '/home/user/project/src/contents/post.mdx'
      const result = extractCategoryFromPath(path)
      expect(result).toBeUndefined()
    })

    it('should extract any category from path', () => {
      const path = '/home/user/project/src/contents/custom/post.mdx'
      const result = extractCategoryFromPath(path)
      expect(result).toBe('custom')
    })

    it('should return undefined for path without contents directory', () => {
      const path = '/home/user/project/src/other/dev/post.mdx'
      const result = extractCategoryFromPath(path)
      expect(result).toBeUndefined()
    })
  })

  describe('parsePostData', () => {
    it('should parse post data with category from frontmatter', () => {
      const mockParsed: PostGrayMatter = {
        content: 'Post content',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
          ],
          description: 'Test description',
          category: 'dev',
        },
        excerpt: '',
        orig: '',
        language: '',
        matter: '',
        stringify: () => '',
      }

      const result = parsePostData(mockParsed, 'test.mdx')

      expect(result.data.category).toBe('dev')
      expect(result.slug).toBe('test')
    })

    it('should infer category from file path when not in frontmatter', () => {
      const mockParsed: PostGrayMatter = {
        content: 'Post content',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
          ],
          description: 'Test description',
        },
        excerpt: '',
        orig: '',
        language: '',
        matter: '',
        stringify: () => '',
      }

      const result = parsePostData(
        mockParsed,
        'test.mdx',
        '/project/src/contents/life/test.mdx'
      )

      expect(result.data.category).toBe('life')
      expect(result.slug).toBe('test')
    })

    it('should prefer frontmatter category over path category', () => {
      const mockParsed: PostGrayMatter = {
        content: 'Post content',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
          ],
          description: 'Test description',
          category: 'dev',
        },
        excerpt: '',
        orig: '',
        language: '',
        matter: '',
        stringify: () => '',
      }

      const result = parsePostData(
        mockParsed,
        'test.mdx',
        '/project/src/contents/life/test.mdx'
      )

      expect(result.data.category).toBe('dev')
      expect(result.slug).toBe('test')
    })
  })

  describe('findAdjacentPosts', () => {
    const posts: Post[] = [
      {
        slug: 'post-1',
        content: 'Content 1',
        author: 'Author 1',
        data: {
          title: 'Post 1',
          date: '2025-01-01',
          description: 'Description 1',
          tags: [
            'tag1',
          ],
        },
      },
      {
        slug: 'post-2',
        content: 'Content 2',
        author: 'Author 2',
        data: {
          title: 'Post 2',
          date: '2025-01-02',
          description: 'Description 2',
          tags: [
            'tag2',
          ],
        },
      },
      {
        slug: 'post-3',
        content: 'Content 3',
        author: 'Author 3',
        data: {
          title: 'Post 3',
          date: '2025-01-03',
          description: 'Description 3',
          tags: [
            'tag3',
          ],
        },
      },
    ]

    it('should return previous and next posts for middle post', () => {
      const result = findAdjacentPosts(posts, 'post-2')

      expect(result.previousPost?.slug).toBe('post-3')
      expect(result.previousPost?.data.title).toBe('Post 3')
      expect(result.nextPost?.slug).toBe('post-1')
      expect(result.nextPost?.data.title).toBe('Post 1')
    })

    it('should return only next post for newest post', () => {
      const result = findAdjacentPosts(posts, 'post-3')

      expect(result.previousPost).toBeUndefined()
      expect(result.nextPost?.slug).toBe('post-2')
      expect(result.nextPost?.data.title).toBe('Post 2')
    })

    it('should return only previous post for oldest post', () => {
      const result = findAdjacentPosts(posts, 'post-1')

      expect(result.previousPost?.slug).toBe('post-2')
      expect(result.previousPost?.data.title).toBe('Post 2')
      expect(result.nextPost).toBeUndefined()
    })

    it('should return empty object for non-existent post', () => {
      const result = findAdjacentPosts(posts, 'non-existent')

      expect(result).toEqual({})
    })

    it('should handle single post', () => {
      const singlePost = [
        posts[0],
      ]
      const result = findAdjacentPosts(singlePost, 'post-1')

      expect(result.previousPost).toBeUndefined()
      expect(result.nextPost).toBeUndefined()
    })

    it('should handle empty posts array', () => {
      const result = findAdjacentPosts([], 'post-1')

      expect(result).toEqual({})
    })
  })
})
