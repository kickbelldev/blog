# 작업 실행 프로세스

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

- ESM 모듈 시스템을 활용해 적절히 인터페이스 노출

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

## 에러 처리

### 클라이언트 사이드
- 사용자 친화적 에러 메시지
- 적절한 폴백 UI 제공
- 개발 환경에서 상세 로깅

### 서버 사이드
- notFound() 함수 활용
- 적절한 에러 바운더리 설정
- Graceful degradation 적용

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
- `docs/`: 문서 업데이트

### 커밋 컨벤션
```
<type>: <description>

[optional body]
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