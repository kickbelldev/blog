// 로직 모듈들 import

import {
  calculateCategoriesWithCount,
  getPostsByCategory as filterPostsByCategory,
  getPostsWithoutCategory as filterPostsWithoutCategory,
  findCategoryById,
  getAllCategories,
  validateCategoryId,
} from './logic/categories'
import { extractHeadingsFromMDX, generateHeadingId } from './logic/headings'
import { filterPostsByTag, findAdjacentPosts, getAllPosts } from './logic/posts'
import {
  analyzeTagRelationships,
  calculateTagStats,
  createTagClusters,
  createTagGraph,
  extractTagsFromPosts,
  findRelatedPostsByTagsOptimized,
  findTagByName,
} from './logic/tags'

// 타입들 re-export
export type * from './types'

// ===== 모듈 레벨 캐싱 =====
export const allPosts = await getAllPosts()
export const allCategories = await getAllCategories()
export const allTags = extractTagsFromPosts(allPosts)
export const tagGraph = createTagGraph(allPosts, allTags)
export const tagClusters = createTagClusters(tagGraph)

// ===== Posts API =====
export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug) || null
}

export function getPostsByTag(tag: string) {
  return filterPostsByTag(allPosts, tag)
}

export function getPostNavigation(currentSlug: string) {
  return findAdjacentPosts(allPosts, currentSlug)
}

export { allPosts as posts }

// ===== Categories API =====
export function getCategoryById(id: string) {
  return findCategoryById(allCategories, id)
}

export function getCategoriesWithCount() {
  return calculateCategoriesWithCount(allCategories, allPosts)
}

export function isValidCategoryId(id: string) {
  return validateCategoryId(allCategories, id)
}

export function getPostsByCategory(categoryId: string) {
  return filterPostsByCategory(allPosts, categoryId)
}

export function getPostsWithoutCategory() {
  return filterPostsWithoutCategory(allPosts)
}

export { allCategories as categories }

// ===== Tags API =====
export function getTagByName(name: string) {
  return findTagByName(allTags, name)
}

export function getTagRelationships() {
  return analyzeTagRelationships(tagGraph)
}

export function getTagClusters() {
  return tagClusters
}

export function getTagStats() {
  return calculateTagStats(allTags)
}

export function getRelatedPostsByTags(currentSlug: string, limit: number = 3) {
  return findRelatedPostsByTagsOptimized(
    allPosts,
    currentSlug,
    tagClusters,
    limit
  )
}

export { allTags as tags }

// ===== Headings API =====
export { extractHeadingsFromMDX, generateHeadingId }

// ===== Default exports =====
export default {
  posts: allPosts,
  categories: allCategories,
  tags: allTags,
}
