# UI 디자인 시스템

## 디자인 원칙

### 일관성 (Consistency)
- 전체 애플리케이션에서 동일한 컴포넌트와 패턴 사용
- 색상, 타이포그래피, 간격의 일관된 적용
- 인터랙션 패턴의 예측 가능성

### 단순성 (Simplicity)
- 불필요한 시각적 요소 제거
- 명확하고 직관적인 인터페이스
- 콘텐츠 중심의 디자인

### 접근성 (Accessibility)
- 모든 사용자가 접근 가능한 디자인
- 충분한 색상 대비와 터치 타겟 크기
- 키보드 네비게이션 지원

## 색상 시스템

### 주 색상 팔레트 (Stone)
```css
/* Light Mode */
--stone-50: #fafaf9
--stone-100: #f5f5f4
--stone-200: #e7e5e4
--stone-300: #d6d3d1
--stone-400: #a8a29e
--stone-500: #78716c
--stone-600: #57534e
--stone-700: #44403c
--stone-800: #292524
--stone-900: #1c1917
--stone-950: #0c0a09

/* Dark Mode */
--stone-50: #0c0a09
--stone-100: #1c1917
--stone-200: #292524
--stone-300: #44403c
--stone-400: #57534e
--stone-500: #78716c
--stone-600: #a8a29e
--stone-700: #d6d3d1
--stone-800: #e7e5e4
--stone-900: #f5f5f4
--stone-950: #fafaf9
```

### 사용 가이드라인
- **배경**: `stone-50` (light) / `stone-950` (dark)
- **카드/컨테이너**: `stone-100` (light) / `stone-900` (dark)
- **테두리**: `stone-200` (light) / `stone-800` (dark)
- **텍스트 주색**: `stone-900` (light) / `stone-100` (dark)
- **텍스트 보조색**: `stone-600` (light) / `stone-400` (dark)

## 타이포그래피

### 폰트 패밀리
- **주 폰트**: Noto Sans KR (한글 지원)
- **코드 폰트**: 시스템 monospace 폰트

### 텍스트 스케일
```css
/* Tailwind Typography Scale */
text-xs: 12px / 16px
text-sm: 14px / 20px
text-base: 16px / 24px
text-lg: 18px / 28px
text-xl: 20px / 28px
text-2xl: 24px / 32px
text-3xl: 30px / 36px
text-4xl: 36px / 40px
```

### 사용 예시
- **페이지 제목**: `text-3xl font-bold text-stone-900`
- **섹션 제목**: `text-2xl font-semibold text-stone-800`
- **본문**: `text-base text-stone-700`
- **캡션**: `text-sm text-stone-500`

## 간격 시스템

### Tailwind Spacing Scale
```css
/* 주요 간격 값 */
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### 사용 가이드라인
- **컴포넌트 내부 패딩**: `p-4` ~ `p-6`
- **컴포넌트 간 마진**: `mb-6` ~ `mb-8`
- **섹션 간 간격**: `mb-12` ~ `mb-16`
- **페이지 패딩**: `px-5` (모바일), `px-8` (데스크톱)

## 컴포넌트 라이브러리

### shadcn/ui 컴포넌트 사용
- **설치**: `npx shadcn@latest add <component-name>`
- **커스터마이징**: 필요시 컴포넌트 코드 직접 수정
- **일관성**: 기본 스타일 유지하되 프로젝트에 맞게 조정

### 주요 컴포넌트
```typescript
// Button 컴포넌트 예시
<Button variant="default" size="md">
  기본 버튼
</Button>

<Button variant="outline" size="sm">
  아웃라인 버튼
</Button>

// Card 컴포넌트 예시
<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
  </CardHeader>
  <CardContent>
    카드 내용
  </CardContent>
</Card>
```

## 레이아웃 패턴

### 컨테이너
```typescript
// 기본 컨테이너
<div className="container mx-auto px-5">
  {/* 콘텐츠 */}
</div>

// 최대 너비 제한
<div className="max-w-5xl mx-auto px-5">
  {/* 콘텐츠 */}
</div>
```

### 그리드 시스템
```typescript
// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 그리드 아이템들 */}
</div>

// 플렉스 레이아웃
<div className="flex flex-col md:flex-row gap-4">
  {/* 플렉스 아이템들 */}
</div>
```

## 반응형 디자인

### 브레이크포인트
```css
sm: 640px   /* 태블릿 */
md: 768px   /* 작은 데스크톱 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 큰 데스크톱 */
2xl: 1536px /* 매우 큰 화면 */
```

### 모바일 퍼스트 접근
```typescript
// 모바일 기본, 태블릿 이상에서 변경
<div className="text-sm md:text-base lg:text-lg">
  반응형 텍스트
</div>

// 모바일에서 숨김, 데스크톱에서 표시
<div className="hidden lg:block">
  데스크톱 전용 콘텐츠
</div>
```

## 상태 및 인터랙션

### 호버 상태
```typescript
<button className="bg-stone-100 hover:bg-stone-200 transition-colors">
  호버 효과
</button>
```

### 포커스 상태
```typescript
<input className="border border-stone-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none" />
```

### 로딩 상태
```typescript
<Button disabled={isLoading}>
  {isLoading ? '로딩 중...' : '제출'}
</Button>
```

## 다크 모드

### 구현 방식
- CSS 변수 기반 테마 시스템
- `dark:` 접두사로 다크 모드 스타일 정의
- 시스템 설정 자동 감지

### 사용 예시
```typescript
<div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
  다크 모드 지원 콘텐츠
</div>
```

## 애니메이션

### 기본 트랜지션
```typescript
// 색상 변화
<div className="transition-colors duration-200">

// 크기 변화  
<div className="transition-transform duration-300 hover:scale-105">

// 투명도 변화
<div className="transition-opacity duration-200 hover:opacity-80">
```

### 페이지 전환
- 부드러운 페이지 전환 효과
- 로딩 상태 표시
- 스켈레톤 UI 활용

## 아이콘 시스템

### Lucide React 사용
```typescript
import { Search, Menu, X, ChevronRight } from 'lucide-react'

// 일관된 크기 사용
<Search className="w-5 h-5" />
<Menu className="w-6 h-6" />
```

### 아이콘 가이드라인
- **크기**: `w-4 h-4` (16px), `w-5 h-5` (20px), `w-6 h-6` (24px)
- **색상**: 텍스트 색상과 동일하게 유지
- **의미**: 직관적이고 일반적으로 인식되는 아이콘 사용

## 에러 및 피드백

### 에러 메시지
```typescript
<div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
  에러 메시지
</div>
```

### 성공 메시지
```typescript
<div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
  성공 메시지
</div>
```

### 정보 메시지
```typescript
<div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
  정보 메시지
</div>
```