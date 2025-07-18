# 스타일링 가이드

Tailwind CSS, shadcn/ui, 디자인 시스템 가이드라인을 정의합니다.

## 기본 원칙

- 구조를 나타내는 것 이상의 상세한 UI 스타일링은 유저의 요청이 없으면 진행하지 않음

### 스타일링 우선순위
1. **기능 구조 우선**: 스타일링보다 로직과 구조 집중
2. **일관성**: 전체 애플리케이션에서 일관된 디자인 언어
3. **접근성**: 모든 사용자가 접근 가능한 디자인
4. **반응형**: 모바일 퍼스트 접근

## shadcn/ui 컴포넌트 사용

### 설치 및 사용
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

### 실제 프로젝트 패턴

#### 색상 클래스 객체 패턴 (CategoryBadge)
```typescript
const colorClasses = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
}

const className = cn(
  'inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md border transition-colors',
  colorClasses[category.color as keyof typeof colorClasses] || colorClasses.gray
)
```

#### 해시 기반 색상 할당 (TagBadge)
```typescript
// getTagColor.ts - 태그별 고유 색상 생성
const TAG_COLORS = [
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  // ... 더 많은 색상
] as const

export function getTagColor(tag: string): string {
  const hash = /* 해시 함수 구현 */
  const index = Math.abs(hash) % TAG_COLORS.length
  return TAG_COLORS[index]
}
```

#### CVA 기반 변형 시스템 (Badge)
```typescript
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)
```

### 성능 고려사항
- **클래스 동적 생성**: `cn()` 유틸리티 사용
- **조건부 스타일**: 삼항 연산자보다 `cn()` 활용
- **재사용성**: 공통 스타일 컴포넌트화

```typescript
// 올바른 예시
const buttonStyles = cn(
  "px-4 py-2 rounded-md font-medium transition-colors",
  isActive && "bg-blue-600 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)
```