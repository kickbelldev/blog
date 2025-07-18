# 프로젝트 개요

Next.js 15 기반의 정적 블로그 애플리케이션으로, MDX를 사용한 콘텐츠 관리와 도메인 주도 설계를 따릅니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **콘텐츠**: MDX with rehype-pretty-code
- **스타일링**: Tailwind CSS 4.0 + shadcn/ui
- **언어**: TypeScript (엄격 모드)
- **코드 품질**: Biome (formatting/linting)
- **테스팅**: Vitest
- **패키지 매니저**: pnpm
- **그래프**: graphology (태그 관계 분석)

## 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router 루트
│   ├── [category]/         # 카테고리별 포스트 목록 페이지
│   │   ├── [slug]/         # 개별 포스트 상세 페이지
│   │   │   └── page.tsx
│   │   ├── _components/    # 카테고리/포스트 관련 컴포넌트
│   │   └── page.tsx
│   ├── _components/        # 전역 공통 컴포넌트
│   ├── _fonts/             # 폰트 설정
│   ├── _lib/               # 공통 유틸리티 함수
│   ├── about/              # About 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
├── contents/               # MDX 블로그 포스트 원본 파일
│   ├── dev/                # 개발 관련 포스트
│   │   ├── category.json   # 카테고리 메타데이터
│   │   └── *.mdx
│   └── life/               # 일상 관련 포스트
│       ├── category.json
│       └── *.mdx
├── entities/               # 도메인 엔티티 (통합)
│   └── blog/               # 블로그 도메인 통합 구조
│       ├── index.ts        # 공개 API + 모듈 레벨 캐싱
│       ├── types.ts        # 모든 타입 정의
│       └── logic/          # 비즈니스 로직 분리
│           ├── posts.ts    # 포스트 관련 로직
│           ├── categories.ts # 카테고리 관련 로직
│           └── tags.ts     # 태그 관련 로직
├── mdx-components.tsx      # MDX 렌더링 시 사용할 커스텀 컴포넌트
└── test/                   # 테스트 관련 설정
```

### 데이터 흐름

1. **빌드 타임**: MDX 파일 → gray-matter 파싱 → 모듈 레벨 캐싱
2. **엔티티 레이어**: 비즈니스 로직 처리 (태그 그래프, 관련 포스트 등)
3. **App Router**: 서버 컴포넌트에서 캐시된 데이터 활용하여 렌더링

### 성능 최적화

#### SSG 최적화
- **모듈 레벨 캐싱**: 빌드 타임에 모든 포스트, 카테고리, 태그 데이터 한 번만 로드
- **사전 계산**: 태그 그래프, 클러스터, 관련 포스트 관계 빌드 타임에 계산
- **정적 생성**: `generateStaticParams()`로 모든 경로 사전 생성

```typescript
// 모듈 레벨 캐싱 예시
export const allPosts = await getAllPosts()
export const allCategories = await getAllCategories()
export const tagGraph = createTagGraph(allPosts, allTags)
export const tagClusters = createTagClusters(tagGraph)
```

## 네이밍 컨벤션

- **라우트가 아닌 폴더**: 언더스코어 접두사 (`_components`, `_lib`)
- **컴포넌트 스코프**: 
  - 전역: `src/app/_components/`
  - 페이지별: `src/app/[route]/_components/`
- **파일명**: kebab-case 또는 PascalCase (컴포넌트)
- **변수/함수**: camelCase
- **타입/인터페이스**: PascalCase
- **상수**: UPPER_SNAKE_CASE

## 콘텐츠 관리

### MDX 구조
```yaml
---
title: '포스트 제목'
date: 2025-01-17
tags: ['tag1', 'tag2']
description: '포스트 설명'
---

# 포스트 내용
```

### 카테고리 메타데이터 (category.json)
```json
{
  "name": "Development",
  "description": "개발 관련 포스트",
  "color": "blue",
  "icon": "💻"
}
```

## 라우팅 구조

- `/` - 메인 페이지 (Hero, 카테고리, 최신 포스트, 태그)
- `/{category}` - 카테고리별 포스트 목록 (dev, life)
- `/{category}/{slug}` - 개별 포스트 상세 페이지
- `/tags` - 태그 목록 및 필터링
- `/about` - About 페이지