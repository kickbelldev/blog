import { getAllPosts } from '../posts'

import {
  analyzeTagRelationships,
  calculateTagStats,
  createTagClusters,
  createTagGraph,
  extractTagsFromPosts,
  findTagByName,
} from './logic'
import type { Tag, TagCluster, TagRelationship } from './types'

/**
 * 모든 태그 정보를 가져옵니다.
 */
export async function getAllTags(): Promise<Tag[]> {
  const posts = await getAllPosts()
  return extractTagsFromPosts(posts)
}

/**
 * 특정 태그의 정보를 가져옵니다.
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  const tags = await getAllTags()
  return findTagByName(tags, name)
}

/**
 * 태그 그래프를 생성합니다.
 */
export async function getTagGraph() {
  const posts = await getAllPosts()
  const tags = await getAllTags()
  return createTagGraph(posts, tags)
}

/**
 * 태그 간의 관계를 분석합니다.
 */
export async function getTagRelationships(): Promise<TagRelationship[]> {
  const graph = await getTagGraph()
  return analyzeTagRelationships(graph)
}

/**
 * 태그 클러스터를 생성합니다.
 */
export async function getTagClusters(): Promise<TagCluster[]> {
  const graph = await getTagGraph()
  return createTagClusters(graph)
}

/**
 * 태그별 포스트 개수 통계를 가져옵니다.
 */
export async function getTagStats() {
  const tags = await getAllTags()
  return calculateTagStats(tags)
}
