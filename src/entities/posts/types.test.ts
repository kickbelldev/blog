import { describe, expect, it } from 'vitest'

import type { Post } from './types'

describe('Posts Types', () => {
  describe('Post interface', () => {
    it('should define correct structure for Post', () => {
      const mockPost: Post = {
        content: 'Test content',
        data: {
          title: 'Test Title',
          date: '2025-01-01',
          tags: [
            'test',
            'example',
          ],
        },
        slug: 'test-post',
        // GrayMatterFile properties
        orig: Buffer.from('test'),
        language: 'en',
        matter: '---\ntitle: Test\n---',
        stringify: () => 'test',
      }

      expect(mockPost.slug).toBe('test-post')
      expect(mockPost.data.title).toBe('Test Title')
      expect(mockPost.data.date).toBe('2025-01-01')
      expect(mockPost.data.tags).toEqual([
        'test',
        'example',
      ])
      expect(mockPost.content).toBe('Test content')
    })

    it('should handle Post without tags', () => {
      const mockPost: Post = {
        content: 'Test content',
        data: {
          title: 'Test Title',
          date: '2025-01-01',
          tags: [],
        },
        slug: 'test-post',
        orig: Buffer.from('test'),
        language: 'en',
        matter: '---\ntitle: Test\n---',
        stringify: () => 'test',
      }

      expect(mockPost.data.tags).toEqual([])
    })

    it('should handle Post with missing optional properties', () => {
      const mockPost: Partial<Post> = {
        content: 'Test content',
        data: {
          title: 'Test Title',
          date: '2025-01-01',
          tags: [
            'test',
          ],
        },
        slug: 'test-post',
      }

      expect(mockPost.slug).toBe('test-post')
      expect(mockPost.data?.title).toBe('Test Title')
    })
  })
})
