import { describe, expect, it } from 'vitest'

import type { Post } from '@/entities/posts/types'

import {
  getAllCategories,
  getCategoriesWithCount,
  getCategoryById,
  getPostsByCategory,
  getPostsWithoutCategory,
  isValidCategoryId,
} from './logic'
import type { CategoryId } from './types'

describe('Categories Logic', () => {
  const mockPosts: Post[] = [
    {
      slug: 'dev-post-1',
      content: 'Content 1',
      author: 'Author 1',
      data: {
        title: 'Dev Post 1',
        date: '2025-01-01',
        tags: [
          'React',
          'TypeScript',
        ],
        description: 'Development post 1',
        category: 'dev',
      },
    },
    {
      slug: 'dev-post-2',
      content: 'Content 2',
      author: 'Author 2',
      data: {
        title: 'Dev Post 2',
        date: '2025-01-02',
        tags: [
          'Next.js',
        ],
        description: 'Development post 2',
        category: 'dev',
      },
    },
    {
      slug: 'life-post-1',
      content: 'Content 3',
      author: 'Author 3',
      data: {
        title: 'Life Post 1',
        date: '2025-01-03',
        tags: [
          'thoughts',
        ],
        description: 'Life post 1',
        category: 'life',
      },
    },
    {
      slug: 'no-category-post',
      content: 'Content 4',
      author: 'Author 4',
      data: {
        title: 'No Category Post',
        date: '2025-01-04',
        tags: [
          'misc',
        ],
        description: 'Post without category',
      },
    },
  ]

  describe('getCategoryById', () => {
    it('should return category for valid ID', async () => {
      const category = await getCategoryById('dev')
      expect(category).toBeDefined()
      expect(category?.id).toBe('dev')
      expect(category?.name).toBe('개발')
    })

    it('should return undefined for invalid ID', async () => {
      const category = await getCategoryById('invalid' as CategoryId)
      expect(category).toBeUndefined()
    })
  })

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = await getAllCategories()
      expect(categories).toHaveLength(2)
      expect(categories.map((c) => c.id)).toContain('dev')
      expect(categories.map((c) => c.id)).toContain('life')
    })
  })

  describe('getCategoriesWithCount', () => {
    it('should return categories with post counts', async () => {
      const categoriesWithCount = await getCategoriesWithCount(mockPosts)

      expect(categoriesWithCount).toHaveLength(2)

      const devCategory = categoriesWithCount.find((c) => c.id === 'dev')
      expect(devCategory?.count).toBe(2)

      const lifeCategory = categoriesWithCount.find((c) => c.id === 'life')
      expect(lifeCategory?.count).toBe(1)
    })

    it('should return zero count for categories with no posts', async () => {
      const categoriesWithCount = await getCategoriesWithCount([])

      expect(categoriesWithCount).toHaveLength(2)
      categoriesWithCount.forEach((category) => {
        expect(category.count).toBe(0)
      })
    })
  })

  describe('getPostsByCategory', () => {
    it('should return posts filtered by category', async () => {
      const devPosts = await getPostsByCategory(mockPosts, 'dev')
      expect(devPosts).toHaveLength(2)
      expect(devPosts.every((post) => post.data.category === 'dev')).toBe(true)

      const lifePosts = getPostsByCategory(mockPosts, 'life')
      expect(lifePosts).toHaveLength(1)
      expect(lifePosts[0].data.category).toBe('life')
    })

    it('should return empty array for category with no posts', async () => {
      const postsWithoutCategory = mockPosts.filter(
        (post) => !post.data.category
      ) as Post[]
      const devPosts = getPostsByCategory(postsWithoutCategory, 'dev')
      expect(devPosts).toHaveLength(0)
    })
  })

  describe('isValidCategoryId', () => {
    it('should return true for valid category IDs', () => {
      expect(isValidCategoryId('dev')).toBe(true)
      expect(isValidCategoryId('life')).toBe(true)
    })

    it('should return false for invalid category IDs', () => {
      expect(isValidCategoryId('invalid')).toBe(false)
      expect(isValidCategoryId('')).toBe(false)
      expect(isValidCategoryId('DEV')).toBe(false)
    })
  })

  describe('getPostsWithoutCategory', () => {
    it('should return posts without category', () => {
      const postsWithoutCategory = getPostsWithoutCategory(mockPosts)
      expect(postsWithoutCategory).toHaveLength(1)
      expect(postsWithoutCategory[0].slug).toBe('no-category-post')
      expect(postsWithoutCategory[0].data.category).toBeUndefined()
    })

    it('should return empty array when all posts have categories', () => {
      const postsWithCategories = mockPosts.filter((post) => post.data.category)
      const postsWithoutCategory = getPostsWithoutCategory(postsWithCategories)
      expect(postsWithoutCategory).toHaveLength(0)
    })
  })
})
