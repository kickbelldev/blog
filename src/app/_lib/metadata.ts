import type { Metadata } from 'next'

import type { Category, Post } from '@/domain/blog'

const SITE_NAME = 'Kayce Blog'
const SITE_DESCRIPTION = '개발 경험과 일상의 생각들을 기록하는 블로그입니다.'
const SITE_URL = 'https://kickbelldev.github.com/blog'

export function createMetadata({
  title,
  description,
  path = '',
  type = 'website',
  publishedTime,
  authors = [
    'Kayce',
  ],
  tags = [],
  section,
}: {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  authors?: string[]
  tags?: string[]
  section?: string
}): Metadata {
  const url = `${SITE_URL}${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      ...(type === 'article' && {
        publishedTime,
        authors,
        tags,
        section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    keywords: tags.length > 0 ? tags : undefined,
  }
}

export function createPostMetadata(
  post: Post,
  categoryName?: string
): Metadata {
  const { title, description, date, tags, category } = post.data
  const url = `/${category || 'uncategorized'}/${post.slug}`

  return createMetadata({
    title,
    description,
    path: url,
    type: 'article',
    publishedTime: new Date(date).toISOString(),
    authors: [
      post.author || 'Kayce',
    ],
    tags,
    section: categoryName,
  })
}

export function createCategoryMetadata(
  category: Category,
  postCount: number
): Metadata {
  const title = `${category.name} - ${SITE_NAME}`
  const description =
    category.description ||
    `${category.name} 카테고리의 포스트들을 확인해보세요.`
  const enhancedDescription = `${description} (${postCount}개 포스트)`

  return createMetadata({
    title,
    description: enhancedDescription,
    path: `/${category.id}`,
  })
}

export function createHomeMetadata(): Metadata {
  return createMetadata({
    title: `${SITE_NAME} - 개발과 일상의 기록`,
    description: SITE_DESCRIPTION,
  })
}

export function createTagsMetadata(): Metadata {
  return createMetadata({
    title: `태그 목록 - ${SITE_NAME}`,
    description: '블로그의 모든 태그를 확인하고 관련 포스트를 찾아보세요.',
    path: '/tags',
  })
}

export function createAboutMetadata(): Metadata {
  return createMetadata({
    title: `About - ${SITE_NAME}`,
    description: '블로그 운영자 Kayce에 대한 소개와 연락 정보입니다.',
    path: '/about',
  })
}
