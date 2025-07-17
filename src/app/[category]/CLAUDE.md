# src/app/[category]/ 동적 라우팅

@/CLAUDE.md
@../CLAUDE.md

카테고리별 포스트 목록과 개별 포스트 상세 페이지를 담당하는 이중 동적 라우팅 구조입니다.

## 역할과 목적

**카테고리/포스트 2단계 라우팅 처리**를 담당합니다. `/dev`, `/life` 같은 카테고리 목록과 `/dev/my-post` 같은 개별 포스트를 모두 처리하며, Next.js의 `generateStaticParams()`로 모든 경로를 빌드 타임에 생성합니다.

## 구조

```
src/app/[category]/
├── [slug]/           # 포스트 상세 (`/dev/my-post`)
│   └── page.tsx
├── _components/      # 포스트 전용 컴포넌트
│   ├── PostHeader.tsx
│   ├── PostNavigation.tsx
│   ├── RelatedPosts.tsx
│   └── TagBadge.tsx
└── page.tsx          # 카테고리 목록 (`/dev`)
```

## 핵심 특징

### 이중 유효성 검증
URL 파라미터와 실제 파일 시스템 구조가 모두 일치하는지 확인합니다. 카테고리 존재성, 포스트 실제 카테고리 매칭 등을 검증합니다.

### 동적 MDX Import
런타임에 `@/contents/${category}/${slug}.mdx` 파일을 동적으로 import하여 포스트 내용을 렌더링합니다.

### 정적 경로 생성
모든 카테고리와 포스트 조합을 빌드 타임에 사전 생성하여 SSG 최적화를 달성합니다.

## 라우팅 패턴

- `/dev` → 개발 카테고리 포스트 목록
- `/dev/my-post` → 개발 카테고리의 특정 포스트
- `/life` → 일상 카테고리 포스트 목록
- `/life/my-thoughts` → 일상 카테고리의 특정 포스트
- 기타등등

## 다른 영역과의 관계

- **src/domain/blog**: 포스트/카테고리 데이터 및 관련 포스트 계산 소비
- **src/contents/**: 동적 MDX import로 실제 콘텐츠 로드
- **_components/**: 포스트 전용 UI 컴포넌트 활용

## 작업 시 주의사항

- 이중 유효성 검증 필수 (카테고리 + 포스트)
- URL 인코딩/디코딩 정확한 처리 
- MDX import 에러 시 notFound() 호출
- Promise 타입 params 처리 (Next.js 15)