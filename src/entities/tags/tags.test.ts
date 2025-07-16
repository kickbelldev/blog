import { UndirectedGraph } from 'graphology'
import { describe, expect, it } from 'vitest'

import type { Post } from '../posts/types'

import {
  analyzeTagRelationships,
  calculateTagStats,
  createTagClusters,
  createTagGraph,
  extractTagsFromPosts,
  findRelatedPostsByTags,
  findTagByName,
} from './logic'
import type { TagEdgeAttributes, TagNodeAttributes } from './types'

describe('Tags Logic', () => {
  const mockPosts: Post[] = [
    {
      slug: 'post1',
      content: 'Content 1',
      author: 'John Doe',
      data: {
        title: 'Post 1',
        description: 'React와 JavaScript를 활용한 웹 개발에 대한 글입니다.',
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
      author: 'Jane Smith',
      data: {
        title: 'Post 2',
        description: 'TypeScript와 React를 함께 사용하는 방법을 다룹니다.',
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
      author: 'Bob Johnson',
      data: {
        title: 'Post 3',
        description: '웹 개발의 기초와 JavaScript 활용법을 설명합니다.',
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
      author: 'Alice Brown',
      data: {
        title: 'Post 4',
        description: 'React와 TypeScript를 이용한 현대적인 개발 방법론입니다.',
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
      author: 'Charlie Wilson',
      data: {
        title: 'Post 5',
        description: 'Node.js와 JavaScript를 활용한 백엔드 개발 가이드입니다.',
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
          author: 'Test Author',
          data: {
            title: 'Post 1',
            description: '태그가 없는 포스트입니다.',
            date: '2025-01-01',
            tags: [],
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          author: 'Another Author',
          data: {
            title: 'Post 2',
            description: 'React에 대한 기본적인 내용을 다룹니다.',
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
          author: 'Test Author',
          data: {
            title: 'Post 1',
            description: '태그가 정의되지 않은 포스트입니다.',
            date: '2025-01-01',
            tags: undefined as any, // Simulate undefined tags
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          author: 'Another Author',
          data: {
            title: 'Post 2',
            description: 'React 개발에 대한 내용입니다.',
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
          author: 'Single Author',
          data: {
            title: 'Post 1',
            description: 'React에 대한 단일 태그 포스트입니다.',
            date: '2025-01-01',
            tags: [
              'React',
            ],
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          author: 'Another Author',
          data: {
            title: 'Post 2',
            description: 'Vue.js에 대한 내용을 다룹니다.',
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
          author: 'Test Author',
          data: {
            title: 'Post 1',
            description: '태그가 정의되지 않은 포스트입니다.',
            date: '2025-01-01',
            tags: undefined as any,
          },
        },
        {
          slug: 'post2',
          content: 'Content 2',
          author: 'React Author',
          data: {
            title: 'Post 2',
            description: 'React 개발 가이드입니다.',
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
          author: 'Isolated Author',
          data: {
            title: 'Post 1',
            description: '독립적인 React 포스트입니다.',
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
          author: 'Single Tag Author',
          data: {
            title: 'Post 1',
            description: '단일 태그를 가진 React 포스트입니다.',
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
          author: 'Dev Author 1',
          data: {
            title: 'Post 1',
            description: 'React와 JavaScript 기초를 다룹니다.',
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
          author: 'Dev Author 2',
          data: {
            title: 'Post 2',
            description: 'React와 TypeScript 조합에 대해 설명합니다.',
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
          author: 'Dev Author 3',
          data: {
            title: 'Post 3',
            description: 'React 테스팅 방법론을 소개합니다.',
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
          author: 'Dev Author 4',
          data: {
            title: 'Post 4',
            description: 'React 성능 최적화 기법을 다룹니다.',
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
          author: 'Vue Author',
          data: {
            title: 'Post 5',
            description: 'Vue.js 프레임워크에 대한 소개입니다.',
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
          author: `Author ${i + 1}`,
          data: {
            title: `Post ${i + 1}`,
            description: `React와 JavaScript를 함께 다루는 포스트 ${i + 1}입니다.`,
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

  describe('findRelatedPostsByTags', () => {
    const postsWithTags: Post[] = [
      {
        slug: 'react-basics',
        content: 'React content',
        author: 'Author 1',
        data: {
          title: 'React Basics',
          date: '2025-01-01',
          description: 'React basics description',
          tags: [
            'React',
            'JavaScript',
            'Frontend',
          ],
        },
      },
      {
        slug: 'vue-intro',
        content: 'Vue content',
        author: 'Author 2',
        data: {
          title: 'Vue Introduction',
          date: '2025-01-02',
          description: 'Vue introduction description',
          tags: [
            'Vue',
            'JavaScript',
            'Frontend',
          ],
        },
      },
      {
        slug: 'node-server',
        content: 'Node content',
        author: 'Author 3',
        data: {
          title: 'Node Server',
          date: '2025-01-03',
          description: 'Node server description',
          tags: [
            'Node.js',
            'JavaScript',
            'Backend',
          ],
        },
      },
      {
        slug: 'python-django',
        content: 'Django content',
        author: 'Author 4',
        data: {
          title: 'Python Django',
          date: '2025-01-04',
          description: 'Django framework description',
          tags: [
            'Python',
            'Django',
            'Backend',
          ],
        },
      },
      {
        slug: 'react-hooks',
        content: 'React hooks content',
        author: 'Author 5',
        data: {
          title: 'React Hooks',
          date: '2025-01-05',
          description: 'React hooks description',
          tags: [
            'React',
            'JavaScript',
            'Hooks',
          ],
        },
      },
    ]

    it('should find related posts based on tag clusters', () => {
      const result = findRelatedPostsByTags(postsWithTags, 'react-basics', 3)

      expect(result.length).toBeGreaterThan(0)
      expect(result.every((post) => post.slug !== 'react-basics')).toBe(true)
    })

    it('should return empty array for post without tags', () => {
      const postWithoutTags: Post = {
        slug: 'no-tags',
        content: 'Content without tags',
        author: 'Author',
        data: {
          title: 'No Tags Post',
          date: '2025-01-01',
          description: 'Description',
          tags: [],
        },
      }

      const result = findRelatedPostsByTags(
        [
          postWithoutTags,
          ...postsWithTags,
        ],
        'no-tags',
        3
      )

      expect(result).toHaveLength(0)
    })

    it('should return empty array for non-existent post', () => {
      const result = findRelatedPostsByTags(postsWithTags, 'non-existent', 3)

      expect(result).toHaveLength(0)
    })

    it('should respect the limit parameter', () => {
      const result = findRelatedPostsByTags(postsWithTags, 'react-basics', 1)

      expect(result.length).toBeLessThanOrEqual(1)
    })

    it('should not include current post in results', () => {
      const result = findRelatedPostsByTags(postsWithTags, 'react-basics', 5)

      expect(result.every((post) => post.slug !== 'react-basics')).toBe(true)
    })

    it('should handle empty posts array', () => {
      const result = findRelatedPostsByTags([], 'react-basics', 3)

      expect(result).toHaveLength(0)
    })

    it('should find posts in same cluster', () => {
      // Create posts with strong clustering relationships
      const clusterPosts: Post[] = [
        {
          slug: 'react-post-1',
          content: 'React content 1',
          author: 'Author 1',
          data: {
            title: 'React Post 1',
            date: '2025-01-01',
            description: 'React description 1',
            tags: [
              'React',
              'JavaScript',
            ],
          },
        },
        {
          slug: 'react-post-2',
          content: 'React content 2',
          author: 'Author 2',
          data: {
            title: 'React Post 2',
            date: '2025-01-02',
            description: 'React description 2',
            tags: [
              'React',
              'JavaScript',
            ],
          },
        },
        {
          slug: 'react-post-3',
          content: 'React content 3',
          author: 'Author 3',
          data: {
            title: 'React Post 3',
            date: '2025-01-03',
            description: 'React description 3',
            tags: [
              'React',
              'JavaScript',
            ],
          },
        },
        {
          slug: 'python-post',
          content: 'Python content',
          author: 'Author 4',
          data: {
            title: 'Python Post',
            date: '2025-01-04',
            description: 'Python description',
            tags: [
              'Python',
            ],
          },
        },
      ]

      const result = findRelatedPostsByTags(clusterPosts, 'react-post-1', 3)

      // Should find other React posts but not Python post
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((post) => post.data.tags.includes('React'))).toBe(
        true
      )
    })
  })
})
