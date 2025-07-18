# Git 워크플로우

브랜치 전략, 커밋 컨벤션, PR 프로세스를 정의합니다.

## 브랜치 전략

### 기본 브랜치
- **main**: 배포용 안정화 브랜치
- **feature/**: 기능 개발용 브랜치
- **fix/**: 버그 수정용 브랜치
- **docs/**: 문서 작업용 브랜치

### 브랜치 네이밍
```bash
# 기능 개발 (실제 프로젝트 패턴)
feat/entities
feat/post-navigation
feat/entity-optimization-and-category-system

# 버그 수정
fix/resolve-navigation-issue
fix/correct-typo-in-header

# 문서/설정 작업
docs/claude-pr-workflow
config/github-templates
config/tailwind-setup
```

## 커밋 컨벤션

### 기본 형식
```
type: subject

body (optional)

footer (optional)
```

### 커밋 타입
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등
- **refactor**: 코드 리팩토링
- **test**: 테스트 추가 또는 수정
- **chore**: 빌드 프로세스 또는 보조 도구 변경

## 논리적 단위 커밋

- 커밋은 변경사항 그룹끼리 묶여서 작성

## PR 프로세스

### PR 생성 전 체크리스트
- [ ] `pnpm test` 통과 확인
- [ ] `pnpm biome:check` 통과 확인  
- [ ] `pnpm type` 통과 확인
- [ ] 커밋 메시지 정리 완료
- [ ] 관련 이슈 연결

### PR 템플릿
```markdown
## 변경사항 요약
<!-- 이 PR에서 변경된 내용을 간략히 설명 -->

## 변경 이유
<!-- 왜 이 변경이 필요한지 설명 -->
```