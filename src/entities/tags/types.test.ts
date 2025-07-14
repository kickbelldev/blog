import { UndirectedGraph } from 'graphology'
import { describe, expect, it } from 'vitest'

import type {
  Tag,
  TagCluster,
  TagEdgeAttributes,
  TagGraph,
  TagNodeAttributes,
  TagRelationship,
} from './types'

describe('Tags Types', () => {
  describe('Tag interface', () => {
    it('should define correct structure for Tag', () => {
      const mockTag: Tag = {
        name: 'React',
        count: 5,
        posts: [
          'post1',
          'post2',
          'post3',
        ],
      }

      expect(mockTag.name).toBe('React')
      expect(mockTag.count).toBe(5)
      expect(mockTag.posts).toEqual([
        'post1',
        'post2',
        'post3',
      ])
    })

    it('should handle Tag with empty posts array', () => {
      const mockTag: Tag = {
        name: 'EmptyTag',
        count: 0,
        posts: [],
      }

      expect(mockTag.posts).toEqual([])
      expect(mockTag.count).toBe(0)
    })
  })

  describe('TagNodeAttributes interface', () => {
    it('should define correct structure for TagNodeAttributes', () => {
      const mockNodeAttrs: TagNodeAttributes = {
        name: 'JavaScript',
        count: 10,
        weight: 0.5,
        posts: [
          'post1',
          'post2',
        ],
      }

      expect(mockNodeAttrs.name).toBe('JavaScript')
      expect(mockNodeAttrs.count).toBe(10)
      expect(mockNodeAttrs.weight).toBe(0.5)
      expect(mockNodeAttrs.posts).toEqual([
        'post1',
        'post2',
      ])
    })
  })

  describe('TagEdgeAttributes interface', () => {
    it('should define correct structure for TagEdgeAttributes', () => {
      const mockEdgeAttrs: TagEdgeAttributes = {
        weight: 0.3,
        cooccurrence: 2,
      }

      expect(mockEdgeAttrs.weight).toBe(0.3)
      expect(mockEdgeAttrs.cooccurrence).toBe(2)
    })
  })

  describe('TagGraph type', () => {
    it('should be compatible with UndirectedGraph', () => {
      const graph: TagGraph = new UndirectedGraph<
        TagNodeAttributes,
        TagEdgeAttributes
      >()

      // Add nodes and edges to verify type compatibility
      graph.addNode('React', {
        name: 'React',
        count: 5,
        weight: 0.5,
        posts: [
          'post1',
          'post2',
        ],
      })

      graph.addNode('JavaScript', {
        name: 'JavaScript',
        count: 8,
        weight: 0.8,
        posts: [
          'post1',
          'post2',
          'post3',
        ],
      })

      graph.addEdge('React', 'JavaScript', {
        weight: 0.4,
        cooccurrence: 3,
      })

      expect(graph.order).toBe(2)
      expect(graph.size).toBe(1)
      expect(graph.hasNode('React')).toBe(true)
      expect(graph.hasEdge('React', 'JavaScript')).toBe(true)
    })
  })

  describe('TagRelationship interface', () => {
    it('should define correct structure for TagRelationship', () => {
      const mockRelationship: TagRelationship = {
        tag: 'React',
        relatedTags: [
          {
            name: 'JavaScript',
            cooccurrence: 5,
            similarity: 0.8,
          },
          {
            name: 'TypeScript',
            cooccurrence: 3,
            similarity: 0.6,
          },
        ],
      }

      expect(mockRelationship.tag).toBe('React')
      expect(mockRelationship.relatedTags).toHaveLength(2)
      expect(mockRelationship.relatedTags[0].name).toBe('JavaScript')
      expect(mockRelationship.relatedTags[0].cooccurrence).toBe(5)
      expect(mockRelationship.relatedTags[0].similarity).toBe(0.8)
    })

    it('should handle TagRelationship with empty relatedTags', () => {
      const mockRelationship: TagRelationship = {
        tag: 'IsolatedTag',
        relatedTags: [],
      }

      expect(mockRelationship.relatedTags).toEqual([])
    })
  })

  describe('TagCluster interface', () => {
    it('should define correct structure for TagCluster', () => {
      const mockCluster: TagCluster = {
        id: 'frontend-cluster',
        name: 'Frontend Technologies',
        tags: [
          'React',
          'Vue',
          'Angular',
        ],
        centrality: 3,
      }

      expect(mockCluster.id).toBe('frontend-cluster')
      expect(mockCluster.name).toBe('Frontend Technologies')
      expect(mockCluster.tags).toEqual([
        'React',
        'Vue',
        'Angular',
      ])
      expect(mockCluster.centrality).toBe(3)
    })

    it('should handle TagCluster with single tag', () => {
      const mockCluster: TagCluster = {
        id: 'single-tag',
        name: 'Single Tag',
        tags: [
          'React',
        ],
        centrality: 0,
      }

      expect(mockCluster.tags).toEqual([
        'React',
      ])
      expect(mockCluster.centrality).toBe(0)
    })
  })
})
