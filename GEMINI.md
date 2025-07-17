# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

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
- **그래프**: graphology

## 디렉토리 구조

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
├── entities/               # 도메인 엔티티 (비즈니스 로직)
│   ├── categories/         # 카테고리 도메인 로직
│   ├── posts/              # 포스트 도메인 로직
│   └── tags/               # 태그 도메인 로직
├── mdx-components.tsx      # MDX 렌더링 시 사용할 커스텀 컴포넌트
└── test/                   # 테스트 관련 설정
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

## 작업 진행 원칙

- 작업의 단위를 가능하면 작게 설정
- 지시가 모호하다고 느껴지면 질문 후 진행

## 구현 원칙

### 점진적 개발
- 한 번에 하나의 태스크만 집중하여 구현
- 태스크 완료 후 사용자 검토 대기, 자동으로 다음 태스크 진행하지 않음
- 각 단계에서 이전 단계의 결과물을 기반으로 구축

### 코드 품질
- TypeScript 엄격 모드 준수, any 타입 사용 금지
- 컴포넌트는 단일 책임 원칙 적용
- Props 인터페이스 명시적 정의
- 적절한 기본값 설정

### 테스트 우선
- 비즈니스 로직 구현 시 단위 테스트 함께 작성
- AAA 패턴 (Arrange, Act, Assert) 준수
- 의미있는 테스트명 사용

## 구현 패턴

### 컴포넌트 설계
- **단일 책임 원칙**: 하나의 컴포넌트는 하나의 역할만
- **Props 인터페이스**: 모든 props에 대한 명시적 타입 정의
- **기본값 설정**: 선택적 props에 대한 적절한 기본값
- **커스텀훅**: 로직은 커스텀훅으로 분리함
- **컴포넌트 분리**: 50줄 이상의 컴포넌트는 분리 고려
- **테스트 금지**: 컴포넌트 자체는 테스트하지 않아야함

```typescript
// 1. 인터페이스 정의
interface ComponentProps {
  required: string
  optional?: boolean
  children?: React.ReactNode
}

// 2. 컴포넌트 구현
export function Component({ 
  required, 
  optional = false, 
  children 
}: ComponentProps) {
  // 구현
}
```

### 비즈니스 로직 구현

- **모듈화**: ESM 모듈 시스템을 활용해 적절히 인터페이스 노출
- **테스트**: 비즈니스 로직의 경우엔 테스트를 해야함

```typescript
// 1. 타입 정의
export type DataType = {
  id: string
  value: string
}

// 2. 로직 함수 구현
export function processData(data: DataType[]): DataType[] {
  // 구현
}

// 3. 테스트 작성
describe('processData', () => {
  it('should process data correctly', () => {
    // 테스트 구현
  })
})
```

### Next.js 아키텍처 준수
- App Router의 이점과 서버 컴포넌트를 적극 활용

### 기능 구조 우선
- 스타일링보다 기능적 구조와 로직에 집중
- 컴포넌트의 역할과 책임을 명확히 정의
- 데이터 흐름과 상태 관리 구조 우선 설계
- UI는 기본적인 레이아웃만 구현하고 세부 스타일링은 후순위

### 아키텍처 중심 접근
- 도메인 로직과 UI 로직의 명확한 분리
- 컴포넌트 간의 의존성과 데이터 전달 구조 설계
- 재사용 가능한 로직의 추상화
- 확장 가능한 구조로 설계

### 최소 스타일링
- 구조화에 필요한 최소한의 스타일링 가능
- 필요시 shadcn/ui의 컴포넌트를 이용

```typescript
// 구조에 집중한 컴포넌트 예시
<div className="container"> {/* 기본 레이아웃만 */}
  <header className="fixed inset-x-0 top-0 h-14">
    {/* 기능적 구조 우선 */}
  </header>
  <main>
    <div className="flex items-center gap-x-2">
      {/* ... */}
    </div>
  </main>
</div>
```

### UI 구현
- **플레이스홀더 사용**: 실제 콘텐츠 대신 `[Page Title]`, `[Description]` 등 사용
- **사용자 승인**: UI 구조 구현 전 명시적 요구사항 확인
- **점진적 구현**: 한 번에 모든 기능 구현하지 않기

## 접근성 고려사항

### 필수 요소
- 시맨틱 HTML 태그 사용
- 적절한 ARIA 레이블
- 키보드 네비게이션 지원
- 충분한 색상 대비

### 구현 예시
```typescript
<button
  aria-label="설명적인 레이블"
  aria-expanded={isExpanded}
  className="focus:outline-none focus:ring-2 focus:ring-stone-500"
>
</button>
```

## 문서화

### 코드 주석
- 복잡한 로직에 대한 설명 주석
- JSDoc 형태의 함수 문서화
- 타입 정의에 대한 설명

## 형상관리

### 브랜치 전략
- `main`: 프로덕션 준비 코드
- `feat/`: 새 기능 (`feat/search-functionality`)
- `fix/`: 버그 수정 (`fix/mobile-nav-issue`)
- `refactor/`: 리팩터링
- `docs/`: 문서 업데이트

### 커밋 컨벤션
```
<type>: <description>

[optional body]

🤖 Generated with Gemini

Co-Authored-By: Gemini <gemini@google.com>
```

**타입:**
- `feat:` - 새 기능
- `fix:` - 버그 수정
- `docs:` - 문서 업데이트
- `config:` - 설정 변경
- `refactor:` - 리팩토링
- `chore:` - 유지보수

#### 커밋 전략
논리적 단위로 나누어서 커밋

## Development Commands

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build the application for production (configured for static export)
- `pnpm start` - Start production server
- `pnpm test` - Run Vitest
- `pnpm type` - Run tsc
- `pnpm biome:check` - Run Biome formatter and linter
- `pnpm biome:fix` - Run Biome formatter and linter with auto-fix
- `pnpm biome:staged` - Run Biome on staged files only

**IMPORTANT**: 
- Do NOT run `pnpm dev` or `pnpm build` during development tasks unless specifically requested by the user. The build process is mainly for final deployment verification.
- When implementing new pages or components, use placeholders instead of actual content. Show what type of content should go in each position rather than writing fake content.
- Do NOT create UI structures arbitrarily. Always ask the user for specific requirements and approval before implementing any UI design or structure.

## Gemini Workflow Instructions

**IMPORTANT**: Gemini must follow this PR-based workflow for ALL development tasks:

### 1. Before Starting Any Task
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b <type>/<description>
```

### 3. After Completing Work
```bash
# Stage and commit changes LOGICALLY
# DO NOT commit everything at once - break into logical commits
git add [specific files for logical group 1]
git commit -m "conventional commit message for group 1"

git add [specific files for logical group 2] 
git commit -m "conventional commit message for group 2"

# Push to remote
git push -u origin <branch-name>

# Create PR immediately
gh pr create --title "PR Title" --body "$(cat <<'EOF'
## Summary
- Brief description of changes
- Key implementation details

## Checklist
- [ ] Checklist item 1
- [ ] Checklist item 2

🤖 Generated with Gemini
EOF
)"
```

**IMPORTANT**: When the user asks to commit changes, NEVER create a single large commit. Always break changes into logical, separate commits such as:
- Documentation changes
- Configuration changes  
- New component implementations
- Layout/styling updates
- Bug fixes
Each commit should represent one logical change or feature.

### 4. PR Requirements
- **Always create PRs**: Never commit directly to main
- **Clear titles**: Use conventional commit format in PR titles
- **Detailed descriptions**: Include Summary and Test plan sections
- **Link issues**: Reference related GitHub issues when applicable

### 5. Work Scope Guidelines
- **One logical change per PR**: Keep PRs focused and reviewable
- **Complete features**: Don't leave work in broken state
- **Test your changes**: Run `pnpm biome:fix` before committing
- **Document breaking changes**: Clearly explain any breaking changes
- **Use placeholders**: When implementing new pages/components, use placeholders like "[Page Title]", "[Description]", "[Content]" instead of actual content
- **No arbitrary UI**: Do NOT create UI structures without explicit user requirements and approval

### 6. After PR Creation
- Wait for CI checks to pass
- Address any review feedback
- Merge only after approval (if working in team) or when CI is green (if solo)

**Remember**: This workflow ensures clean git history, proper code review, and CI validation for all changes.

### Styling

- Uses Tailwind CSS with custom configuration
- shadcn/ui for UI components
- CSS variables for theming (light/dark mode support)
- Noto Sans KR font for Korean language support
- Prose styling for blog content rendering
- use stone base color

### Build Output

Static files are generated in the `out/` directory during build.
