import { UndirectedGraph } from 'graphology'

import type { Post } from '../posts/types'

import type {
  Tag,
  TagCluster,
  TagEdgeAttributes,
  TagNodeAttributes,
  TagRelationship,
} from './types'

/**
 * 포스트 목록에서 모든 태그를 추출하고 개수를 계산합니다.
 */
export function extractTagsFromPosts(posts: Post[]): Tag[] {
  const tagMap: Record<string, Tag> = {}

  for (const post of posts) {
    const tags = post.data.tags || []

    for (const tagName of tags) {
      if (tagMap[tagName]) {
        const tag = tagMap[tagName]
        tag.count += 1
        tag.posts.push(post.slug)
      } else {
        tagMap[tagName] = {
          name: tagName,
          count: 1,
          posts: [
            post.slug,
          ],
        }
      }
    }
  }

  return Object.values(tagMap).sort((a, b) => b.count - a.count)
}

/**
 * 특정 이름의 태그를 찾습니다.
 */
export function findTagByName(tags: Tag[], name: string): Tag | null {
  return tags.find((tag) => tag.name === name) || null
}

/**
 * 포스트 목록으로부터 태그 그래프를 생성합니다.
 */
export function createTagGraph(
  posts: Post[],
  tags: Tag[]
): UndirectedGraph<TagNodeAttributes, TagEdgeAttributes> {
  const graph = new UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>()

  // 노드 추가
  for (const tag of tags) {
    graph.addNode(tag.name, {
      name: tag.name,
      count: tag.count,
      weight: tag.count / posts.length,
      posts: tag.posts,
    })
  }

  // 엣지 생성을 위한 동시 출현 관계 계산
  const cooccurrenceMap = new Map<string, number>()

  for (const post of posts) {
    const postTags = post.data.tags || []

    // 같은 포스트에 있는 태그들 간의 관계 계산
    for (let i = 0; i < postTags.length; i++) {
      for (let j = i + 1; j < postTags.length; j++) {
        const tag1 = postTags[i]
        const tag2 = postTags[j]
        const key = [
          tag1,
          tag2,
        ]
          .sort()
          .join('|')

        cooccurrenceMap.set(key, (cooccurrenceMap.get(key) || 0) + 1)
      }
    }
  }

  // 엣지 추가
  for (const [key, count] of cooccurrenceMap) {
    const [source, target] = key.split('|')

    if (graph.hasNode(source) && graph.hasNode(target)) {
      graph.addEdge(source, target, {
        weight: count / posts.length,
        cooccurrence: count,
      })
    }
  }

  return graph
}

/**
 * 그래프로부터 태그 간의 관계를 분석합니다.
 */
export function analyzeTagRelationships(
  graph: UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>
): TagRelationship[] {
  const relationships: TagRelationship[] = []

  graph.forEachNode((node) => {
    const relatedTags: TagRelationship['relatedTags'] = []

    graph.forEachNeighbor(node, (neighbor) => {
      const edgeAttributes = graph.getEdgeAttributes(node, neighbor)
      const nodeAttributes = graph.getNodeAttributes(node)
      const neighborAttributes = graph.getNodeAttributes(neighbor)

      relatedTags.push({
        name: neighbor,
        cooccurrence: edgeAttributes.cooccurrence,
        similarity:
          edgeAttributes.weight /
          Math.max(nodeAttributes.weight, neighborAttributes.weight),
      })
    })

    relatedTags.sort((a, b) => b.similarity - a.similarity)

    relationships.push({
      tag: node,
      relatedTags,
    })
  })

  return relationships
}

/**
 * 그래프로부터 태그 클러스터를 생성합니다.
 */
export function createTagClusters(
  graph: UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>
): TagCluster[] {
  const clusters: TagCluster[] = []
  const processed = new Set<string>()

  // 각 노드의 degree centrality 계산
  const centralityMap = new Map<string, number>()
  graph.forEachNode((node) => {
    centralityMap.set(node, graph.degree(node))
  })

  // centrality 기준으로 정렬된 노드들
  const sortedNodes = Array.from(centralityMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([node]) => node)

  for (const node of sortedNodes) {
    if (processed.has(node)) continue

    const cluster: TagCluster = {
      id: node,
      name: node,
      tags: [
        node,
      ],
      centrality: centralityMap.get(node) || 0,
    }

    // 강하게 연결된 이웃 노드들을 클러스터에 추가
    const neighbors: Array<{
      node: string
      weight: number
    }> = []

    graph.forEachNeighbor(node, (neighbor) => {
      if (!processed.has(neighbor)) {
        const edgeAttributes = graph.getEdgeAttributes(node, neighbor)
        neighbors.push({
          node: neighbor,
          weight: edgeAttributes.weight,
        })
      }
    })

    // 가중치 기준으로 정렬하여 상위 5개만 선택
    neighbors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .forEach(({ node: neighbor, weight }) => {
        if (weight > 0.3) {
          // 임계값 이상인 경우만
          cluster.tags.push(neighbor)
          processed.add(neighbor)
        }
      })

    processed.add(node)
    clusters.push(cluster)
  }

  return clusters
}

/**
 * 태그 통계를 계산합니다.
 */
export function calculateTagStats(tags: Tag[]) {
  const total = tags.reduce((sum, tag) => sum + tag.count, 0)

  return {
    total: tags.length,
    totalOccurrences: total,
    mostUsed: tags[0],
    leastUsed: tags[tags.length - 1],
    average: tags.length > 0 ? total / tags.length : 0,
  }
}
