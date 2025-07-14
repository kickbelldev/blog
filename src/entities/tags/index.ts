import { UndirectedGraph } from 'graphology'

import { getAllPosts } from '../posts'

import type {
  Tag,
  TagCluster,
  TagEdgeAttributes,
  TagGraph,
  TagNodeAttributes,
  TagRelationship,
} from './types'

/**
 * 모든 태그 정보를 가져옵니다.
 */
export async function getAllTags(): Promise<Tag[]> {
  const posts = await getAllPosts()
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
 * 특정 태그의 정보를 가져옵니다.
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  const tags = await getAllTags()
  return tags.find((tag) => tag.name === name) || null
}

/**
 * 태그 그래프를 생성합니다.
 */
export async function getTagGraph(): Promise<
  UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>
> {
  const posts = await getAllPosts()
  const tags = await getAllTags()

  // graphology 인스턴스 생성
  const graph = new UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>()

  // 노드 추가
  for (const tag of tags) {
    graph.addNode(tag.name, {
      name: tag.name,
      count: tag.count,
      weight: tag.count / posts.length, // 전체 포스트 대비 비율
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

    // 두 노드가 모두 존재하는 경우에만 엣지 추가
    if (graph.hasNode(source) && graph.hasNode(target)) {
      graph.addEdge(source, target, {
        weight: count / posts.length, // 전체 포스트 대비 동시 출현 비율
        cooccurrence: count, // 실제 동시 출현 횟수
      })
    }
  }

  return graph
}

/**
 * 태그 간의 관계를 분석합니다.
 */
export async function getTagRelationships(): Promise<TagRelationship[]> {
  const graph = await getTagGraph()
  const relationships: TagRelationship[] = []

  // 모든 노드에 대해 관계 분석
  graph.forEachNode((node) => {
    const relatedTags: TagRelationship['relatedTags'] = []

    // 해당 노드의 모든 이웃 노드 순회
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

    // 유사도 기준으로 정렬
    relatedTags.sort((a, b) => b.similarity - a.similarity)

    relationships.push({
      tag: node,
      relatedTags,
    })
  })

  return relationships
}

/**
 * 태그 클러스터를 생성합니다 (graphology 기반).
 */
export async function getTagClusters(): Promise<TagCluster[]> {
  const graph = await getTagGraph()
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

    // 가중치 기준으로 정렬하여 상위 3개만 선택
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
 * 태그별 포스트 개수 통계를 가져옵니다.
 */
export async function getTagStats() {
  const tags = await getAllTags()
  const total = tags.reduce((sum, tag) => sum + tag.count, 0)

  return {
    total: tags.length,
    totalOccurrences: total,
    mostUsed: tags[0],
    leastUsed: tags[tags.length - 1],
    average: tags.length > 0 ? total / tags.length : 0,
  }
}
