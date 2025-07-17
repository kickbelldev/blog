# src/app/ App Router UI 레이어

@/CLAUDE.md

Next.js 15 App Router를 사용한 프레젠테이션 레이어입니다.

## 역할과 목적

**도메인 로직을 UI로 변환**하는 역할을 담당합니다. 서버 컴포넌트 우선 접근으로 SSG에 최적화된 사용자 인터페이스를 구성하며, 도메인 API를 통해 비즈니스 데이터를 받아 React 컴포넌트로 렌더링합니다.

## 구조

```
src/app/
├── [category]/        # 동적 라우팅 - 카테고리별 페이지
├── _components/       # 전역 공통 컴포넌트 (Header, Footer)
├── _fonts/           # 폰트 설정 (Noto Sans KR)
├── _lib/             # UI 유틸리티 함수
├── about/            # 정적 페이지
├── layout.tsx        # 루트 레이아웃
├── page.tsx          # 메인 페이지
└── globals.css       # 전역 스타일
```

## 핵심 특징

### 서버 컴포넌트 우선
기본적으로 모든 컴포넌트는 서버에서 렌더링됩니다. 클라이언트 상호작용이 필요한 경우에만 'use client' 지시어를 사용합니다.

### 동적 라우팅
`[category]/[slug]` 패턴으로 카테고리별 포스트를 처리합니다. `generateStaticParams()`로 모든 경로를 빌드 타임에 사전 생성합니다.

### 도메인 API 통합
`@/domain/blog`에서 제공하는 캐싱된 데이터를 직접 사용하여 런타임 성능을 최적화합니다.

## 라우팅 구조

- `/` - 메인 페이지 (Hero, 카테고리, 최신 포스트)
- `/{category}` - 카테고리별 포스트 목록
- `/{category}/{slug}` - 개별 포스트 상세
- `/about` - About 페이지

## 다른 영역과의 관계

- **src/domain/**: 도메인 API import로 비즈니스 데이터 소비
- **src/contents/**: 동적 MDX import로 콘텐츠 렌더링
- **_components/**: 전역 컴포넌트 재사용
- **_lib/**: UI 관련 유틸리티 함수 활용

## 작업 시 주의사항

- 비즈니스 로직은 도메인 레이어에서만 처리
- 서버/클라이언트 컴포넌트 경계 명확히 구분
- 동적 라우팅 파라미터 유효성 검증 필수
- TypeScript 타입 안전성 확보