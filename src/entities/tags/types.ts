import type { UndirectedGraph } from 'graphology'

export interface Tag {
  name: string
  count: number
  posts: string[] // post slugs
}

export interface TagNodeAttributes {
  name: string
  count: number
  weight: number // 태그의 중요도
  posts: string[] // post slugs
}

export interface TagEdgeAttributes {
  weight: number // 두 태그가 함께 나타나는 빈도
  cooccurrence: number // 실제 동시 출현 횟수
}

export type TagGraph = UndirectedGraph<TagNodeAttributes, TagEdgeAttributes>

export interface TagRelationship {
  tag: string
  relatedTags: Array<{
    name: string
    cooccurrence: number // 함께 나타나는 횟수
    similarity: number // 유사도 점수 (0-1)
  }>
}

export interface TagCluster {
  id: string
  name: string
  tags: string[]
  centrality: number // 클러스터의 중심성
}
