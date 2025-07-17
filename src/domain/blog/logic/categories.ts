import fs from 'node:fs/promises'
import path from 'node:path'

import type { Category, CategoryId, CategoryWithCount, Post } from '../types'

const contentsDirectory = path.join(process.cwd(), 'src/contents')

/**
 * 모든 카테고리 목록 조회
 */
export async function getAllCategories(): Promise<Category[]> {
  const categoryDirs = await fs.readdir(contentsDirectory, {
    withFileTypes: true,
  })
  const categories = await Promise.all(
    categoryDirs
      .filter((dirent) => dirent.isDirectory())
      .map(async (dirent) => {
        const categoryId = dirent.name
        const filePath = path.join(
          contentsDirectory,
          categoryId,
          'category.json'
        )
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8')
          const categoryData = JSON.parse(fileContent)
          return {
            id: categoryId,
            ...categoryData,
          }
        } catch (_error) {
          // category.json이 없거나 파싱 오류 시 기본값 사용
          return {
            id: categoryId,
            name: categoryId,
          }
        }
      })
  )
  return categories
}

/**
 * 카테고리 ID로 카테고리 정보 조회
 */
export function findCategoryById(
  categories: Category[],
  id: CategoryId
): Category | undefined {
  return categories.find((category) => category.id === id)
}

/**
 * 카테고리별 포스트 개수와 함께 카테고리 목록 조회
 */
export function calculateCategoriesWithCount(
  categories: Category[],
  posts: Post[]
): CategoryWithCount[] {
  const categoryCountMap = new Map<CategoryId, number>()

  posts.forEach((post) => {
    const categoryId = post.data.category
    if (categoryId) {
      categoryCountMap.set(
        categoryId,
        (categoryCountMap.get(categoryId) || 0) + 1
      )
    }
  })

  return categories.map((category) => ({
    ...category,
    count: categoryCountMap.get(category.id) || 0,
  }))
}

/**
 * 특정 카테고리에 속한 포스트 필터링
 */
export function getPostsByCategory(
  posts: Post[],
  categoryId: CategoryId
): Post[] {
  return posts.filter((post) => post.data.category === categoryId)
}

/**
 * 카테고리 ID 유효성 검증
 */
export function validateCategoryId(
  categories: Category[],
  id: string
): boolean {
  return categories.some((category) => category.id === id)
}

/**
 * 카테고리가 없는 포스트 필터링
 */
export function getPostsWithoutCategory(posts: Post[]): Post[] {
  return posts.filter((post) => !post.data.category)
}
