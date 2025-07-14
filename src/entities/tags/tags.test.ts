import { UndirectedGraph } from 'graphology'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getAllTags,
  getTagByName,
  getTagClusters,
  getTagGraph,
  getTagRelationships,
  getTagStats,
} from './index'

// Mock posts entity
vi.mock('../posts', () => ({
  getAllPosts: vi.fn(),
}))

const mockGetAllPosts = vi.mocked(await import('../posts')).getAllPosts

describe('Tags Entity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockPosts = [
    {
      slug: 'post1',
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
      slug: 'post1',
      data: {
        title: 'Post 1',
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
      slug: 'post1',
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
      data: {
        title: 'Post 3',
        date: '2025-01-03',
        tags: [
          'JavaScript',
          'Node.js',
        ],
      },
    },
  ]

  describe('getAllTags', () => {
    it('should return all tags with counts and post references', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const result = await getAllTags()

      expect(result).toHaveLength(5)

      // Should be sorted by count (descending)
      expect(result[0]).toEqual({
        name: 'React',
        count: 4,
        posts: [
          'post1',
          'post1',
          'post1',
          'post2',
        ],
      })
      expect(result[1]).toEqual({
        name: 'JavaScript',
        count: 4,
        posts: [
          'post1',
          'post1',
          'post1',
          'post3',
        ],
      })

      // Single occurrence tags
      expect(result.find((tag) => tag.name === 'TypeScript')).toEqual({
        name: 'TypeScript',
        count: 2,
        posts: [
          'post1',
          'post2',
        ],
      })
    })

    it('should handle posts without tags', async () => {
      const postsWithoutTags = [
        {
          slug: 'post1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
          },
        },
        {
          slug: 'post2',
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'React',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(postsWithoutTags as any)

      const result = await getAllTags()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        name: 'React',
        count: 1,
        posts: [
          'post2',
        ],
      })
    })

    it('should handle empty posts array', async () => {
      mockGetAllPosts.mockResolvedValue([])

      const result = await getAllTags()

      expect(result).toEqual([])
    })
  })

  describe('getTagByName', () => {
    it('should return specific tag by name', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const result = await getTagByName('React')

      expect(result).toEqual({
        name: 'React',
        count: 4,
        posts: [
          'post1',
          'post1',
          'post1',
          'post2',
        ],
      })
    })

    it('should return null for non-existent tag', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const result = await getTagByName('NonExistent')

      expect(result).toBeNull()
    })
  })

  describe('getTagGraph', () => {
    it('should create a graph with nodes and edges', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const graph = await getTagGraph()

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
        weight: 4 / 5, // 2 occurrences out of 3 posts
        posts: [
          'post1',
          'post1',
          'post1',
          'post2',
        ],
      })

      // Check edges (co-occurrence)
      expect(graph.hasEdge('React', 'JavaScript')).toBe(true) // Both in post1
      expect(graph.hasEdge('React', 'TypeScript')).toBe(true) // Both in post2
      expect(graph.hasEdge('JavaScript', 'Node.js')).toBe(true) // Both in post3

      // Check edge attributes
      const edgeAttrs = graph.getEdgeAttributes('React', 'JavaScript')
      expect(edgeAttrs).toEqual({
        weight: 3 / 5, // 3 co-occurrence out of 5 posts
        cooccurrence: 3,
      })
    })

    it('should handle single tag posts', async () => {
      const singleTagPosts = [
        {
          slug: 'post1',
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
          data: {
            title: 'Post 2',
            date: '2025-01-02',
            tags: [
              'Vue',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(singleTagPosts as any)

      const graph = await getTagGraph()

      expect(graph.order).toBe(2)
      expect(graph.size).toBe(0) // No edges since no co-occurrences
    })
  })

  describe('getTagRelationships', () => {
    it('should return relationships for all tags', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const relationships = await getTagRelationships()

      expect(relationships).toHaveLength(5)

      // Find React relationships
      const reactRelationship = relationships.find((r) => r.tag === 'React')
      expect(reactRelationship).toBeDefined()
      expect(reactRelationship!.relatedTags).toHaveLength(3) // JavaScript, TypeScript, Web

      // Should be sorted by similarity (descending)
      expect(reactRelationship!.relatedTags[0].name).toBe('JavaScript')
      expect(reactRelationship!.relatedTags[0].cooccurrence).toBe(3)
      expect(reactRelationship!.relatedTags[0].similarity).toBeGreaterThan(0)
    })

    it('should handle tags with no relationships', async () => {
      const isolatedTagPosts = [
        {
          slug: 'post1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [
              'React',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(isolatedTagPosts as any)

      const relationships = await getTagRelationships()

      expect(relationships).toHaveLength(1)
      expect(relationships[0].tag).toBe('React')
      expect(relationships[0].relatedTags).toHaveLength(0)
    })
  })

  describe('getTagClusters', () => {
    it('should create clusters based on centrality', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const clusters = await getTagClusters()

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

    it('should handle single tag scenario', async () => {
      const singleTagPosts = [
        {
          slug: 'post1',
          data: {
            title: 'Post 1',
            date: '2025-01-01',
            tags: [
              'React',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(singleTagPosts as any)

      const clusters = await getTagClusters()

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

    it('should handle weak relationships in clustering', async () => {
      // Create posts with weak co-occurrence relationships
      const weakRelationshipPosts = [
        {
          slug: 'post1',
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
          data: {
            title: 'Post 5',
            date: '2025-01-05',
            tags: [
              'Vue',
            ],
          },
        },
      ]

      mockGetAllPosts.mockResolvedValue(weakRelationshipPosts as any)

      const clusters = await getTagClusters()

      // React should be the main cluster with high centrality
      const reactCluster = clusters.find((c) => c.id === 'React')
      expect(reactCluster).toBeDefined()
      expect(reactCluster!.centrality).toBe(4) // Connected to 4 other tags

      // Vue should be isolated with no connections
      const vueCluster = clusters.find((c) => c.id === 'Vue')
      expect(vueCluster).toBeDefined()
      expect(vueCluster!.centrality).toBe(0)
      expect(vueCluster!.tags).toEqual([
        'Vue',
      ])
    })
  })

  describe('getTagStats', () => {
    it('should return comprehensive tag statistics', async () => {
      mockGetAllPosts.mockResolvedValue(mockPosts as any)

      const stats = await getTagStats()

      expect(stats).toEqual({
        total: 5, // 5 unique tags
        totalOccurrences: 14, // Total tag occurrences across all posts
        mostUsed: {
          name: 'React',
          count: 4,
          posts: [
            'post1',
            'post1',
            'post1',
            'post2',
          ],
        },
        leastUsed: expect.objectContaining({
          count: 1,
        }),
        average: 14 / 5, // Average occurrences per tag
      })
    })

    it('should handle no tags', async () => {
      mockGetAllPosts.mockResolvedValue([])

      const stats = await getTagStats()

      expect(stats).toEqual({
        total: 0,
        totalOccurrences: 0,
        mostUsed: undefined,
        leastUsed: undefined,
        average: 0,
      })
    })
  })
})
