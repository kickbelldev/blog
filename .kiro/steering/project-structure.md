# 프로젝트 구조 및 개발 가이드라인

## 프로젝트 개요

Next.js 15 기반의 정적 블로그 애플리케이션으로, MDX를 사용한 콘텐츠 관리와 도메인 주도 설계를 따릅니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **콘텐츠**: MDX with rehype-pretty-code
- **스타일링**: Tailwind CSS + shadcn/ui
- **언어**: TypeScript
- **코드 품질**: Biome (formatting/linting)
- **테스팅**: Vitest
- **패키지 매니저**: pnpm

## 디렉토리 구조

```
src/
├── app/                    # Next.js App Router 루트
│   ├── _components/        # 전역 컴포넌트
│   ├── _fonts/            # 폰트 설정
│   ├── _lib/              # 유틸리티 함수
│   ├── posts/[slug]/      # 동적 포스트 페이지
│   ├── about/             # About 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 전역 스타일
├── entities/              # 도메인 엔티티
│   ├── posts/            # 포스트 도메인 로직
│   └── tags/             # 태그 도메인 로직
└── contents/             # MDX 블로그 포스트
```

## 네이밍 컨벤션

- **라우트가 아닌 폴더**: 언더스코어 접두사 사용 (`_components`, `_hooks`)
- **컴포넌트 스코프**: 
  - 전역: `src/app/_components/`
  - 페이지별: `src/app/[route]/_components/`
- **파일명**: kebab-case 또는 PascalCase (컴포넌트)

## 도메인 아키텍처

### 엔티티 구조
- `src/entities/posts/`: 포스트 관련 비즈니스 로직
  - `index.ts`: 공개 API
  - `types.ts`: 타입 정의
  - `logic.ts`: 비즈니스 로직
  - `*.test.ts`: 테스트 파일

### 데이터 흐름
1. MDX 파일 (`src/contents/`) → gray-matter 파싱
2. 엔티티 레이어에서 비즈니스 로직 처리
3. App Router 페이지에서 렌더링

## 스타일링 가이드라인

### Tailwind CSS
- **컬러 팔레트**: `stone` 계열 사용 (`text-stone-900`, `border-stone-200`)
- **반응형**: 모바일 퍼스트 접근
- **다크모드**: CSS 변수 기반 테마 지원

### shadcn/ui 컴포넌트
- **설치**: `npx shadcn@latest add <component>`
- **위치**: `src/app/_components/ui/`
- **스타일**: "new-york" 스타일, stone 베이스 컬러
- **아이콘**: Lucide React 사용

## 콘텐츠 관리

### 콘텐츠 위치
`src/contents/*.mdx`

### MDX 구조
```yaml
---
title: '포스트 제목'
slug: 'post-slug'
date: 2025-01-01
tags: ['tag1', 'tag2']
---

# 포스트 내용
```

## 배포 설정

- **basePath**: `/blog` (GitHub Pages 등을 위한 설정)
- **출력**: 정적 파일 (`out/` 디렉토리)
- **환경**: Node.js 환경에서 빌드, 정적 호스팅 가능