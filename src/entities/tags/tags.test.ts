import { UndirectedGraph } from 'graphology'
import { describe, expect, it } from 'vitest'

import type { Post } from '../posts/types'

import {
  analyzeTagRelationships,
  calculateTagStats,
  createTagClusters,
  createTagGraph,
  extractTagsFromPosts,
  findTagByName,
} from './logic'
import type { TagEdgeAttributes, TagNodeAttributes } from './types'

describe('Tags Logic', () => {
  const mockPosts: Post[] = [
    {
      slug: 'post1',
      content: 'Content 1',
      data: {
        title: 'Post 1',
        date: '2025-01-01',
        tags: [
          'React',
          'JavaScript',
          'Web',
        ],
      },
    },
    {
      slug: 'post2',
      content: 'Content 2',
      data: {
        title: 'Post 2',
        date: '2025-01-01',
        tags: [
          'React',
          'JavaScript',
          'Web',
          'TypeScript',
        ],
      },
    },
    {
      slug: 'post3',
      content: 'Content 3',
      data: {
        title: 'Post 3',
        date: '2025-01-01',
        tags: [
          'React',
          'JavaScript',
          'Web',
        ],
      },
    },
    {
      slug: 'post4',
      content: 'Content 4',
      data: {
        title: 'Post 4',
        date: '2025-01-02',
        tags: [
          'React',
          'TypeScript',
        ],
      },
    },
    {
      slug: 'post5',
      content: 'Content 5',
      data: {
        title: 'Post 5',
        date: '2025-01-03',
        tags: [
          'JavaScript',
          'Node.js',
        ],
      },
    },
  ]

  describe('extractTagsFromPosts', () => {
    it('should extract all tags with counts and post references', () => {
      const result = extractTagsFromPosts(mockPosts)

      expect(result).toHaveLength(5)

      // Should be sorted by count (descending)
      expect(result[0]).toEqual({
        name: 'React',
        count: 4,
        posts: [
          'post1',
          'post2',
          'post3',
          'post4',
        ],
      })
      expect(result[1]).toEqual({
        name: 'JavaScript',
        count: 4,
        posts: [
          'post1',
          'post2',
          'post3',
          'post5',
        ],
      })

      // Single occurrence tags
      expect(result.find((tag) => tag.name === 'TypeScript')).toEqual({
        name: 'TypeScript',
        count: 2,
        posts: [
          'post2',
          'post4',
        ],
      })
    })

    it('should handle posts without tags', () => {
      const postsWithoutTags: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [],
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'React',
            ],
          },
        },
      ]

      const result = extractTagsFromPosts(postsWithoutTags)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        name: 'React',
        count: 1,
        posts: [
          'post2',
        ],
      })
    })

    it('should handle empty posts array', () => {
      const result = extractTagsFromPosts([])
      expect(result).toEqual([])
    })

    it('should handle posts with undefined tags', () => {
      const postsWithUndefinedTags: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: undefined as any, // Simulate undefined tags
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'React',
            ],
          },
        },
      ]

      const result = extractTagsFromPosts(postsWithUndefinedTags)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        name: 'React',
        count: 1,
        posts: [
          'post2',
        ],
      })
    })
  })

  describe('findTagByName', () => {
    it('should find specific tag by name', () => {
      const tags = extractTagsFromPosts(mockPosts)
      const result = findTagByName(tags, 'React')

      expect(result).toEqual({
        name: 'React',
        count: 4,
        posts: [
          'post1',
          'post2',
          'post3',
          'post4',
        ],
      })
    })

    it('should return null for non-existent tag', () => {
      const tags = extractTagsFromPosts(mockPosts)
      const result = findTagByName(tags, 'NonExistent')

      expect(result).toBeNull()
    })

    it('should handle empty tags array', () => {
      const result = findTagByName([], 'React')
      expect(result).toBeNull()
    })
  })

  describe('createTagGraph', () => {
    it('should create a graph with nodes and edges', () => {
      const tags = extractTagsFromPosts(mockPosts)
      const graph = createTagGraph(mockPosts, tags)

      expect(graph).toBeInstanceOf(UndirectedGraph)

      // Check nodes
      expect(graph.order).toBe(5) // 5 unique tags
      expect(graph.hasNode('React')).toBe(true)
      expect(graph.hasNode('JavaScript')).toBe(true)
      expect(graph.hasNode('TypeScript')).toBe(true)

      // Check node attributes
      const reactAttrs = graph.getNodeAttributes('React')
      expect(reactAttrs).toEqual({
        name: 'React',
        count: 4,
        weight: 4 / 5, // 4 occurrences out of 5 posts
        posts: [
          'post1',
          'post2',
          'post3',
          'post4',
        ],
      })

      // Check edges (co-occurrence)
      expect(graph.hasEdge('React', 'JavaScript')).toBe(true)
      expect(graph.hasEdge('React', 'TypeScript')).toBe(true)
      expect(graph.hasEdge('JavaScript', 'Node.js')).toBe(true)

      // Check edge attributes
      const edgeAttrs = graph.getEdgeAttributes('React', 'JavaScript')
      expect(edgeAttrs).toEqual({
        weight: 3 / 5, // 3 co-occurrence out of 5 posts
        cooccurrence: 3,
      })
    })

    it('should handle single tag posts', () => {
      const singleTagPosts: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [
              'React',
            ],
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'Vue',
            ],
          },
        },
      ]

      const tags = extractTagsFromPosts(singleTagPosts)
      const graph = createTagGraph(singleTagPosts, tags)

      expect(graph.order).toBe(2)
      expect(graph.size).toBe(0) // No edges since no co-occurrences
    })

    it('should handle empty posts', () => {
      const tags = extractTagsFromPosts([])
      const graph = createTagGraph([], tags)

      expect(graph.order).toBe(0)
      expect(graph.size).toBe(0)
    })

    it('should handle posts with undefined tags in graph creation', () => {
      const postsWithUndefinedTags: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: undefined as any,
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'React',
            ],
          },
        },
      ]

      const tags = extractTagsFromPosts(postsWithUndefinedTags)
      const graph = createTagGraph(postsWithUndefinedTags, tags)

      expect(graph.order).toBe(1) // Only React tag
      expect(graph.size).toBe(0) // No edges since only one tag
    })
  })

  describe('analyzeTagRelationships', () => {
    it('should return relationships for all tags', () => {
      const tags = extractTagsFromPosts(mockPosts)
      const graph = createTagGraph(mockPosts, tags)
      const relationships = analyzeTagRelationships(graph)

      expect(relationships).toHaveLength(5)

      // Find React relationships
      const reactRelationship = relationships.find((r) => r.tag === 'React')
      expect(reactRelationship).toBeDefined()
      expect(reactRelationship?.relatedTags).toHaveLength(3) // JavaScript, TypeScript, Web

      // Should be sorted by similarity (descending)
      expect(reactRelationship?.relatedTags[0].name).toBe('JavaScript')
      expect(reactRelationship?.relatedTags[0].cooccurrence).toBe(3)
      expect(reactRelationship?.relatedTags[0].similarity).toBeGreaterThan(0)
    })

    it('should handle tags with no relationships', () => {
      const isolatedTagPosts: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [
              'React',
            ],
          },
        },
      ]

      const tags = extractTagsFromPosts(isolatedTagPosts)
      const graph = createTagGraph(isolatedTagPosts, tags)
      const relationships = analyzeTagRelationships(graph)

      expect(relationships).toHaveLength(1)
      expect(relationships[0].tag).toBe('React')
      expect(relationships[0].relatedTags).toHaveLength(0)
    })

    it('should handle empty graph', () => {
      const graph = new UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>()
      const relationships = analyzeTagRelationships(graph)

      expect(relationships).toEqual([])
    })
  })

  describe('createTagClusters', () => {
    it('should create clusters based on centrality', () => {
      const tags = extractTagsFromPosts(mockPosts)
      const graph = createTagGraph(mockPosts, tags)
      const clusters = createTagClusters(graph)

      expect(clusters.length).toBeGreaterThan(0)

      // Should be sorted by centrality (descending)
      expect(clusters[0].centrality).toBeGreaterThanOrEqual(
        clusters[1]?.centrality || 0
      )

      // Each cluster should have at least the main tag
      clusters.forEach((cluster) => {
        expect(cluster.tags).toContain(cluster.name)
        expect(cluster.tags.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should handle single tag scenario', () => {
      const singleTagPosts: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [
              'React',
            ],
          },
        },
      ]

      const tags = extractTagsFromPosts(singleTagPosts)
      const graph = createTagGraph(singleTagPosts, tags)
      const clusters = createTagClusters(graph)

      expect(clusters).toHaveLength(1)
      expect(clusters[0]).toEqual({
        id: 'React',
        name: 'React',
        tags: [
          'React',
        ],
        centrality: 0, // No connections
      })
    })

    it('should handle weak relationships in clustering', () => {
      const weakRelationshipPosts: Post[] = [
        {
          slug: 'post1',
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [
              'React',
              'JavaScript',
            ],
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'React',
              'TypeScript',
            ],
          },
        },
        {
          slug: 'post3',
          content: 'Content 3',
          data: {
            title: 'Post 3',
            date: '2025-01-03',
            tags: [
              'React',
              'Testing',
            ],
          },
        },
        {
          slug: 'post4',
          content: 'Content 4',
          data: {
            title: 'Post 4',
            date: '2025-01-04',
            tags: [
              'React',
              'Performance',
            ],
          },
        },
        {
          slug: 'post5',
          content: 'Content 5',
          data: {
            title: 'Post 5',
            date: '2025-01-05',
            tags: [
              'Vue',
            ],
          },
        },
      ]

      const tags = extractTagsFromPosts(weakRelationshipPosts)
      const graph = createTagGraph(weakRelationshipPosts, tags)
      const clusters = createTagClusters(graph)

      // React should be the main cluster with high centrality
      const reactCluster = clusters.find((c) => c.id === 'React')
      expect(reactCluster).toBeDefined()
      expect(reactCluster?.centrality).toBe(4) // Connected to 4 other tags

      // Vue should be isolated with no connections
      const vueCluster = clusters.find((c) => c.id === 'Vue')
      expect(vueCluster).toBeDefined()
      expect(vueCluster?.centrality).toBe(0)
      expect(vueCluster?.tags).toEqual([
        'Vue',
      ])
    })

    it('should test strong relationships threshold in clustering', () => {
      // Create posts with very strong co-occurrence (5 out of 5 posts)
      const strongRelationshipPosts: Post[] = Array.from(
        {
          length: 5,
        },
        (_, i) => ({
          slug: `post${i + 1}`,
          content: `Content ${i + 1}`,
          data: {
            title: `Post ${i + 1}`,
            date: `2025-01-0${i + 1}`,
            tags: [
              'React',
              'JavaScript',
            ],
          },
        })
      )

      const tags = extractTagsFromPosts(strongRelationshipPosts)
      const graph = createTagGraph(strongRelationshipPosts, tags)
      const clusters = createTagClusters(graph)

      // Should create clusters with strong relationships
      const reactCluster = clusters.find((c) => c.id === 'React')
      expect(reactCluster).toBeDefined()
      expect(reactCluster?.tags).toContain('JavaScript') // Should include JavaScript due to high weight (1.0 > 0.3)
    })

    it('should handle empty graph', () => {
      const graph = new UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>()
      const clusters = createTagClusters(graph)

      expect(clusters).toEqual([])
    })
  })

  describe('calculateTagStats', () => {
    it('should return comprehensive tag statistics', () => {
      const tags = extractTagsFromPosts(mockPosts)
      const stats = calculateTagStats(tags)

      expect(stats).toEqual({
        total: 5, // 5 unique tags
        totalOccurrences: 14, // Total tag occurrences across all posts
        mostUsed: {
          name: 'React',
          count: 4,
          posts: [
            'post1',
            'post2',
            'post3',
            'post4',
          ],
        },
        leastUsed: expect.objectContaining({
          count: 1,
        }),
        average: 14 / 5, // Average occurrences per tag
      })
    })

    it('should handle no tags', () => {
      const stats = calculateTagStats([])

      expect(stats).toEqual({
        total: 0,
        totalOccurrences: 0,
        mostUsed: undefined,
        leastUsed: undefined,
        average: 0,
      })
    })

    it('should handle single tag', () => {
      const singleTag = [
        {
          name: 'React',
          count: 5,
          posts: [
            'post1',
            'post2',
            'post3',
            'post4',
            'post5',
          ],
        },
      ]

      const stats = calculateTagStats(singleTag)

      expect(stats).toEqual({
        total: 1,
        totalOccurrences: 5,
        mostUsed: singleTag[0],
        leastUsed: singleTag[0],
        average: 5,
      })
    })
  })
})
