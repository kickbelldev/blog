import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Post } from './posts/types'
import { getAllTags, getTagGraph, getTagRelationships } from './tags'

// Mock posts entity with simplified data
vi.mock('./posts', () => ({
  getAllPosts: vi.fn(),
}))

const mockGetAllPosts = vi.mocked(await import('./posts')).getAllPosts

describe('Entities Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Posts and Tags Integration', () => {
    it('should correctly extract tags from posts and create relationships', async () => {
      const mockPosts: Pick<Post, 'slug' | 'data'>[] = [
        {
          slug: 'next-js-guide',
          data: {
            title: 'Next.js 완벽 가이드',
            date: '2025-01-01',
            tags: [
              'Next.js',
              'React',
              'SSR',
            ],
          },
        },
        {
          slug: 'react-hooks',
          data: {
            title: 'React Hooks 마스터하기',
            date: '2025-01-02',
            tags: [
              'React',
              'Hooks',
              'JavaScript',
            ],
          },
        },
        {
          slug: 'typescript-tips',
          data: {
            title: 'TypeScript 팁과 트릭',
            date: '2025-01-03',
            tags: [
              'TypeScript',
              'JavaScript',
              'Development',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(mockPosts as Post[])

      // Test tags extraction
      const tags = await getAllTags()
      expect(tags).toHaveLength(7) // All unique tags

      // React should be most used (appears in 2 posts)
      const reactTag = tags.find((tag) => tag.name === 'React')
      expect(reactTag).toEqual({
        name: 'React',
        count: 2,
        posts: [
          'next-js-guide',
          'react-hooks',
        ],
      })

      // JavaScript should also appear in 2 posts
      const jsTag = tags.find((tag) => tag.name === 'JavaScript')
      expect(jsTag).toEqual({
        name: 'JavaScript',
        count: 2,
        posts: [
          'react-hooks',
          'typescript-tips',
        ],
      })
    })

    it('should create proper graph relationships between tags', async () => {
      const mockPosts: Pick<Post, 'slug' | 'data'>[] = [
        {
          slug: 'web-dev',
          data: {
            title: 'Web Development',
            date: '2025-01-01',
            tags: [
              'HTML',
              'CSS',
              'JavaScript',
            ],
          },
        },
        {
          slug: 'frontend',
          data: {
            title: 'Frontend Framework',
            date: '2025-01-02',
            tags: [
              'JavaScript',
              'React',
              'Vue',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(mockPosts as Post[])

      const graph = await getTagGraph()

      // Should have all 5 unique tags as nodes
      expect(graph.order).toBe(5)
      expect(graph.hasNode('HTML')).toBe(true)
      expect(graph.hasNode('CSS')).toBe(true)
      expect(graph.hasNode('JavaScript')).toBe(true)
      expect(graph.hasNode('React')).toBe(true)
      expect(graph.hasNode('Vue')).toBe(true)

      // Check co-occurrence edges
      expect(graph.hasEdge('HTML', 'CSS')).toBe(true) // Both in web-dev
      expect(graph.hasEdge('HTML', 'JavaScript')).toBe(true) // Both in web-dev
      expect(graph.hasEdge('CSS', 'JavaScript')).toBe(true) // Both in web-dev
      expect(graph.hasEdge('JavaScript', 'React')).toBe(true) // Both in frontend
      expect(graph.hasEdge('JavaScript', 'Vue')).toBe(true) // Both in frontend
      expect(graph.hasEdge('React', 'Vue')).toBe(true) // Both in frontend

      // Should not have edges between non-co-occurring tags
      expect(graph.hasEdge('HTML', 'React')).toBe(false)
      expect(graph.hasEdge('CSS', 'Vue')).toBe(false)

      // Check JavaScript centrality (appears in both posts)
      const jsAttrs = graph.getNodeAttributes('JavaScript')
      expect(jsAttrs.count).toBe(2)
      expect(jsAttrs.weight).toBe(1) // 2 occurrences out of 2 posts
      expect(graph.degree('JavaScript')).toBe(4) // Connected to 4 other tags
    })

    it('should analyze tag relationships correctly', async () => {
      const mockPosts = [
        {
          slug: 'react-guide',
          data: {
            title: 'React Guide',
            date: '2025-01-01',
            tags: [
              'React',
              'JavaScript',
              'Frontend',
            ],
          },
        },
        {
          slug: 'vue-guide',
          data: {
            title: 'Vue Guide',
            date: '2025-01-02',
            tags: [
              'Vue',
              'JavaScript',
              'Frontend',
            ],
          },
        },
        {
          slug: 'js-fundamentals',
          data: {
            title: 'JS Fundamentals',
            date: '2025-01-03',
            tags: [
              'JavaScript',
              'Programming',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(mockPosts as Post[])

      const relationships = await getTagRelationships()

      // JavaScript should have the most relationships (appears in all 3 posts)
      const jsRelationship = relationships.find((r) => r.tag === 'JavaScript')
      expect(jsRelationship).toBeDefined()
      expect(jsRelationship?.relatedTags).toHaveLength(4) // React, Vue, Frontend, Programming

      // Frontend should be connected to React and Vue
      const frontendRelationship = relationships.find(
        (r) => r.tag === 'Frontend'
      )
      expect(frontendRelationship).toBeDefined()
      expect(frontendRelationship?.relatedTags).toHaveLength(3) // JavaScript, React, Vue

      // Programming should only be connected to JavaScript
      const programmingRelationship = relationships.find(
        (r) => r.tag === 'Programming'
      )
      expect(programmingRelationship).toBeDefined()
      expect(programmingRelationship?.relatedTags).toHaveLength(1) // Only JavaScript
      expect(programmingRelationship?.relatedTags[0].name).toBe('JavaScript')
    })

    it('should handle edge cases in integration', async () => {
      const mockPosts = [
        {
          slug: 'no-tags',
          data: {
            title: 'No Tags Post',
            date: '2025-01-01',
          },
        },
        {
          slug: 'empty-tags',
          data: {
            title: 'Empty Tags Post',
            date: '2025-01-02',
            tags: [],
          },
        },
        {
          slug: 'normal-post',
          data: {
            title: 'Normal Post',
            date: '2025-01-03',
            tags: [
              'Normal',
              'Post',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(mockPosts as Post[])

      const tags = await getAllTags()
      expect(tags).toHaveLength(2) // Only 'Normal' and 'Post' from the third post

      const graph = await getTagGraph()
      expect(graph.order).toBe(2) // Only 2 nodes
      expect(graph.size).toBe(1) // Only 1 edge (Normal-Post)
    })
  })

  describe('Real-world Data Simulation', () => {
    it('should handle blog-like data structure', async () => {
      const mockPosts = [
        {
          slug: 'getting-started-with-react',
          data: {
            title: 'Getting Started with React',
            date: '2025-01-01',
            tags: [
              'React',
              'JavaScript',
              'Frontend',
              'Beginner',
            ],
          },
        },
        {
          slug: 'advanced-typescript-patterns',
          data: {
            title: 'Advanced TypeScript Patterns',
            date: '2025-01-02',
            tags: [
              'TypeScript',
              'JavaScript',
              'Advanced',
              'Patterns',
            ],
          },
        },
        {
          slug: 'building-with-nextjs',
          data: {
            title: 'Building with Next.js',
            date: '2025-01-03',
            tags: [
              'Next.js',
              'React',
              'SSR',
              'Frontend',
            ],
          },
        },
        {
          slug: 'javascript-fundamentals',
          data: {
            title: 'JavaScript Fundamentals',
            date: '2025-01-04',
            tags: [
              'JavaScript',
              'Fundamentals',
              'Beginner',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(mockPosts as Post[])

      const tags = await getAllTags()
      const graph = await getTagGraph()
      const relationships = await getTagRelationships()

      // Verify comprehensive data processing
      expect(tags.length).toBeGreaterThan(0)
      expect(graph.order).toBeGreaterThan(0)
      expect(relationships.length).toBeGreaterThan(0)

      // JavaScript should be the most connected tag
      const jsNode = relationships.find((r) => r.tag === 'JavaScript')
      expect(jsNode).toBeDefined()
      expect(jsNode?.relatedTags.length).toBeGreaterThanOrEqual(3)

      // Verify graph structure makes sense
      expect(graph.hasEdge('React', 'Frontend')).toBe(true) // Co-occur in 2 posts
      expect(graph.hasEdge('JavaScript', 'Beginner')).toBe(true) // Co-occur in 2 posts
      expect(graph.hasEdge('Next.js', 'React')).toBe(true) // Co-occur in 1 post
    })
  })
})
