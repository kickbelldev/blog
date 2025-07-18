# CLAUDE.md

Next.js 15 기반 정적 블로그의 아키텍처 지침과 작업 가이드입니다.

## 🔧 핵심 원칙

### ⚠️ 가장 중요한 지침
- **스코프별 CLAUDE.md 유지**: 작업할 때마다 해당 디렉토리의 CLAUDE.md를 업데이트
- **계층적 컨텍스트 상속**: 하위 CLAUDE.md는 상위 문서들을 import하여 전체 맥락 확보
- **컨텍스트 지역화**: 각 디렉토리별로 구체적이고 정확한 작업 컨텍스트 유지
- **실시간 업데이트**: 코드 변경과 동시에 해당 영역의 CLAUDE.md 즉시 반영

### 제약사항
- 개발서버/빌드 실행 금지
- 코드에 실제 레터링 대신 placeholder 사용
- 스코프별 CLAUDE.md는 50줄 이내로 간결 작성

## 🏗️ 아키텍처 원칙

### 도메인 주도 설계 (DDD)
- **도메인 로직**: `src/domain/` 에 비즈니스 로직 중앙집중
- **UI 분리**: `src/app/` 에 프레젠테이션 레이어 분리  
- **데이터 흐름**: 도메인 → UI 단방향 의존성

### 모듈 레벨 캐싱
- **빌드 타임 최적화**: 모든 데이터 사전 로드 및 캐싱
- **SSG 최적화**: 정적 사이트 생성을 위한 성능 최적화
- **관계 사전 계산**: 태그 그래프, 클러스터, 관련 포스트 빌드 타임 계산

### 타입 안전성
- **TypeScript 엄격 모드**: `any` 타입 금지
- **명시적 타입**: 모든 인터페이스와 함수 시그니처 명시
- **도메인 타입 중심**: 비즈니스 로직의 타입 우선 설계

## 📁 전체 구조 맵

```
/
├── src/
│   ├── domain/                 # 🧠 비즈니스 로직
│   │   └── blog/              # 블로그 도메인 (SSG 캐싱, 태그 그래프)
│   ├── app/                   # 🎨 UI 레이어 (Next.js App Router)
│   │   ├── [category]/        # 동적 라우팅 (카테고리별 페이지)
│   │   ├── _components/       # 전역 공통 컴포넌트
│   │   └── _lib/              # UI 유틸리티 함수
│   └── contents/              # 📝 MDX 콘텐츠
├── .context/                  # 📚 프로젝트 문서
└── CLAUDE.md                  # 🗺️ 마스터 아키텍처 (이 문서)
```

## 🔗 스코프별 CLAUDE.md 링크

### 1뎁스 - 주요 영역
- `src/domain/CLAUDE.md` - 도메인 로직 전체 맥락
- `src/app/CLAUDE.md` - App Router 구조와 패턴  
- `src/contents/CLAUDE.md` - MDX 콘텐츠 관리 규칙

### 2뎁스 - 세부 구현
- `src/domain/blog/CLAUDE.md` - 블로그 도메인 세부사항
- `src/app/[category]/CLAUDE.md` - 동적 라우팅 구조
- `src/app/_components/CLAUDE.md` - 전역 컴포넌트 역할
- `src/app/_lib/CLAUDE.md` - 유틸리티 함수 목적

## 📖 추가 프로젝트 문서

### 개발 가이드
- @.context/development-guidelines.md - 구현 패턴, 품질 기준
- @.context/styling-guide.md - Tailwind CSS, shadcn/ui 가이드
- @.context/git-workflow.md - 브랜치 전략, 커밋 컨벤션

### 참조 정보  
- @.context/current-status.md - 최신 작업 상태
- @.context/project-overview.md - 기술 스택, 상세 구조
- @.context/commands.md - 개발 명령어, 빌드 설정

## 🚀 작업 흐름

1. **작업 영역 파악**: 수정할 파일의 디렉토리 확인
2. **컨텍스트 확보**: 해당 영역의 CLAUDE.md 및 상위 문서 읽기
3. **아키텍처 준수**: 도메인 분리, 타입 안전성, 성능 원칙 적용
4. **문서 업데이트**: 작업 완료 후 해당 CLAUDE.md 즉시 업데이트
5. **상위 영향 확인**: 변경사항이 상위 아키텍처에 미치는 영향 검토

---

💡 **Tip**: 새로운 기능 개발 시 먼저 해당 영역의 CLAUDE.md를 확인하고, 기존 패턴을 따라 일관성을 유지하세요.