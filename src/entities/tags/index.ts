import posts from '../posts'

import {
  analyzeTagRelationships,
  calculateTagStats,
  createTagClusters,
  createTagGraph,
  extractTagsFromPosts,
  findRelatedPostsByTags,
  findRelatedPostsByTagsOptimized,
  findTagByName,
} from './logic'
import type { Tag, TagCluster, TagRelationship } from './types'

/**
 * 모든 태그 정보를 가져옵니다.
 */
export async function getAllTags(): Promise<Tag[]> {
  return extractTagsFromPosts(posts)
}

const tags = await getAllTags()

/**
 * 특정 태그의 정보를 가져옵니다.
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  return findTagByName(tags, name)
}

// 태그 그래프를 모듈 레벨에서 캐시
const tagGraph = createTagGraph(posts, tags)

/**
 * 태그 그래프를 생성합니다.
 */
export function getTagGraph() {
  return tagGraph
}

/**
 * 태그 간의 관계를 분석합니다.
 */
export function getTagRelationships(): TagRelationship[] {
  return analyzeTagRelationships(tagGraph)
}

/**
 * 태그 클러스터를 생성합니다.
 */
export function getTagClusters(): TagCluster[] {
  return createTagClusters(tagGraph)
}

/**
 * 태그별 포스트 개수 통계를 가져옵니다.
 */
export async function getTagStats() {
  const tags = await getAllTags()
  return calculateTagStats(tags)
}

// 태그 클러스터를 모듈 레벨에서 캐시
const tagClusters = createTagClusters(tagGraph)

/**
 * 현재 포스트와 태그 기반으로 관련된 포스트들을 찾습니다.
 */
export function getRelatedPostsByTags(currentSlug: string, limit: number = 3) {
  return findRelatedPostsByTagsOptimized(posts, currentSlug, tagClusters, limit)
}
