# 개발 가이드라인

이 블로그 프로젝트의 핵심 패턴과 구현 원칙을 정의합니다.

## 아키텍처 패턴

### 도메인 중심 설계
- **도메인 로직**: `src/domain/blog/` 에 통합
- **UI 컴포넌트**: `src/app/` 하위에 구현
- **타입 정의**: `src/domain/blog/types.ts` 중앙 집중

```typescript
// 도메인 API 사용 예시
import { getCategoryById, getPostsByCategory, getRelatedPostsByTags } from '@/domain/blog'

const category = getCategoryById('dev')
const posts = getPostsByCategory('dev')
const related = getRelatedPostsByTags(currentSlug, 3)
```

### 모듈 레벨 캐싱
빌드 타임에 모든 데이터를 사전 로드하여 SSG 최적화

```typescript
// src/domain/blog/index.ts
export const allPosts = await getAllPosts()
export const allCategories = await getAllCategories()
export const allTags = extractTagsFromPosts(allPosts)
export const tagGraph = createTagGraph(allPosts, allTags)
export const tagClusters = createTagClusters(tagGraph)
```

### 태그 그래프 시스템
graphology 라이브러리로 태그 간 관계 분석

```typescript
// 태그 관계 분석
const relationships = getTagRelationships()
const clusters = getTagClusters()
const relatedPosts = getRelatedPostsByTags(currentSlug, 3)
```

## 콘텐츠 구조

### MDX 파일 구조
```
src/contents/
├── dev/           # 개발 카테고리
│   ├── category.json
│   └── *.mdx
└── life/          # 일상 카테고리
    ├── category.json
    └── *.mdx
```

### 포스트 frontmatter
```yaml
---
title: '포스트 제목'
date: 2025-01-17
tags: ['tag1', 'tag2']
description: '포스트 설명'
category: 'dev'  # 또는 'life'
---
```

### 카테고리 메타데이터
```json
{
  "name": "개발",
  "description": "개발 관련 포스트",
  "color": "blue",
  "icon": "💻"
}
```

## 컴포넌트 패턴

### 타입 정의
```typescript
interface PostHeaderProps {
  title: string
  date: string
  tags: string[]
  category?: CategoryId
  readingTime?: number
  author?: string
  className?: string
}
```

### 컴포넌트 구현
```typescript
// 서버 컴포넌트 기본, 상호작용 필요시만 클라이언트
export function PostHeader({ title, date, tags, category }: PostHeaderProps) {
  return (
    <header className={cn('mb-8 pb-8', className)}>
      <div className="flex items-center gap-3 mb-4">
        {category && <CategoryBadge categoryId={category} />}
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <TagList tags={tags} />
    </header>
  )
}
```

## 품질 기준

### TypeScript 엄격 모드
- `any` 타입 사용 금지
- 모든 Props 인터페이스 명시적 정의
- 도메인 타입 재사용 (`CategoryId`, `Post`, `Tag`)

### 테스트 패턴
```typescript
// 비즈니스 로직 테스트
describe('태그 그래프 시스템', () => {
  it('관련 포스트를 태그 유사도로 찾는다', () => {
    const related = getRelatedPostsByTags('test-slug', 3)
    expect(related).toHaveLength(3)
  })
})
```

### 성능 최적화
- 모든 데이터 빌드 타임 사전 계산
- `generateStaticParams()` 사용한 정적 경로 생성
- 컴포넌트 간 props 최소화

## 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── [category]/         # 카테고리 페이지
│   │   ├── [slug]/         # 포스트 상세
│   │   └── _components/    # 페이지별 컴포넌트
│   └── _components/        # 전역 컴포넌트
├── domain/blog/            # 도메인 로직
│   ├── index.ts            # 공개 API + 캐싱
│   ├── types.ts            # 타입 정의
│   └── logic/              # 비즈니스 로직
│       ├── posts.ts
│       ├── categories.ts
│       └── tags.ts
└── contents/               # MDX 콘텐츠
    ├── dev/
    └── life/
```

## 구현 원칙

1. **도메인 API 사용**: 직접 파일 시스템 접근 금지
2. **타입 안전성**: 모든 데이터 흐름 타입 보장
3. **모듈 레벨 캐싱**: 빌드 타임 데이터 사전 로드
4. **컴포넌트 단순화**: 단일 책임 원칙