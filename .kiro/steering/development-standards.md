# 개발 표준 및 베스트 프랙티스

## 코드 작성 원칙

### TypeScript 사용
- 모든 파일에서 엄격한 타입 체크 적용
- `any` 타입 사용 금지, 적절한 타입 정의 필수
- 인터페이스와 타입 별칭 적절히 활용
- 제네릭 타입 활용으로 재사용성 향상

### 컴포넌트 설계
- **단일 책임 원칙**: 하나의 컴포넌트는 하나의 역할만
- **Props 인터페이스**: 모든 props에 대한 명시적 타입 정의
- **기본값 설정**: 선택적 props에 대한 적절한 기본값
- **컴포넌트 분리**: 50줄 이상의 컴포넌트는 분리 고려

```typescript
// 좋은 예
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  children 
}: ButtonProps) {
  // 구현
}
```

### 상태 관리
- **로컬 상태**: `useState` 사용, 필요시에만 상태 끌어올리기
- **서버 상태**: Next.js의 정적 생성 활용
- **전역 상태**: 복잡한 상태는 Context API 또는 상태 관리 라이브러리 고려

## 파일 구조 및 네이밍

### 파일 네이밍
- **컴포넌트**: PascalCase (`Header.tsx`, `PostCard.tsx`)
- **유틸리티**: camelCase (`formatDate.ts`, `cn.ts`)
- **페이지**: Next.js 컨벤션 따름 (`page.tsx`, `layout.tsx`)
- **타입**: PascalCase with suffix (`PostType.ts`, `UserInterface.ts`)

### Import 순서 (Biome 설정 준수)
1. Node.js 내장 모듈
2. 외부 패키지
3. 내부 모듈 (`@/` 경로)
4. 상대 경로 (`../`, `./`)

```typescript
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import matter from 'gray-matter'
import { clsx } from 'clsx'

import { cn } from '@/app/_lib/cn'

import { parsePostData } from './logic'
```

## 스타일링 표준

### Tailwind CSS 사용법
- **유틸리티 클래스**: 인라인 스타일 대신 Tailwind 클래스 사용
- **컴포넌트 추출**: 반복되는 스타일은 컴포넌트로 추출
- **반응형**: 모바일 퍼스트, `sm:`, `md:`, `lg:` 브레이크포인트 활용
- **다크모드**: `dark:` 접두사로 다크모드 스타일 정의

### 색상 팔레트
- **주 색상**: `stone` 계열 (`stone-50` ~ `stone-950`)
- **강조 색상**: 필요시 `blue`, `green`, `red` 등 사용
- **일관성**: 전체 애플리케이션에서 동일한 색상 체계 유지

```typescript
// 좋은 예
<div className="bg-stone-50 border border-stone-200 text-stone-900 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100">
```

## 성능 최적화

### Next.js 최적화
- **이미지**: `next/image` 컴포넌트 사용
- **폰트**: `next/font` 사용으로 폰트 최적화
- **동적 import**: 필요시에만 컴포넌트 로드
- **메타데이터**: 적절한 SEO 메타데이터 설정

### 번들 크기 최적화
- **Tree shaking**: 사용하지 않는 코드 제거
- **코드 분할**: 페이지별 코드 분할
- **외부 라이브러리**: 필요한 기능만 import

## 테스트 전략

### 단위 테스트
- **비즈니스 로직**: `src/entities/` 내 로직 함수들
- **유틸리티 함수**: `src/app/_lib/` 내 헬퍼 함수들
- **테스트 파일**: `*.test.ts` 또는 `*.spec.ts` 확장자

### 테스트 작성 원칙
- **AAA 패턴**: Arrange, Act, Assert
- **의미있는 테스트명**: 테스트 의도가 명확히 드러나는 이름
- **독립성**: 각 테스트는 독립적으로 실행 가능

```typescript
// 좋은 예
describe('formatDate', () => {
  it('should format ISO date string to Korean format', () => {
    // Arrange
    const isoDate = '2025-01-15'
    
    // Act
    const result = formatDate(isoDate)
    
    // Assert
    expect(result).toBe('2025년 1월 15일')
  })
})
```

## 에러 처리

### 클라이언트 사이드
- **에러 바운더리**: React 에러 바운더리 활용
- **사용자 친화적 메시지**: 기술적 에러를 사용자가 이해할 수 있는 메시지로 변환
- **로깅**: 개발 환경에서 적절한 에러 로깅

### 서버 사이드
- **404 처리**: `notFound()` 함수 활용
- **에러 페이지**: 커스텀 에러 페이지 제공
- **Graceful degradation**: 일부 기능 실패 시에도 기본 기능은 동작

## 접근성 (a11y)

### 기본 원칙
- **시맨틱 HTML**: 적절한 HTML 태그 사용
- **ARIA 레이블**: 스크린 리더를 위한 적절한 레이블
- **키보드 네비게이션**: 모든 인터랙티브 요소 키보드 접근 가능
- **색상 대비**: WCAG 가이드라인 준수

### 구현 예시
```typescript
// 좋은 예
<button
  aria-label="메뉴 열기"
  aria-expanded={isOpen}
  onClick={toggleMenu}
  className="focus:outline-none focus:ring-2 focus:ring-stone-500"
>
  <MenuIcon />
</button>
```

## 보안 고려사항

### 콘텐츠 보안
- **XSS 방지**: 사용자 입력 적절히 이스케이프
- **MDX 보안**: 신뢰할 수 있는 MDX 콘텐츠만 렌더링
- **이미지 최적화**: 외부 이미지 소스 검증

### 정적 사이트 보안
- **환경 변수**: 민감한 정보는 빌드 타임에만 사용
- **의존성 관리**: 정기적인 보안 업데이트
- **CSP 헤더**: 적절한 Content Security Policy 설정