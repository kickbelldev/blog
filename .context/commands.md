# 명령어 레퍼런스

프로젝트에서 사용하는 주요 명령어들을 정리합니다.

## 개발 명령어

### 패키지 관리
```bash
# 의존성 설치
pnpm install

# 패키지 추가/제거
pnpm add <package-name>
pnpm add -D <package-name>  # 개발 의존성
pnpm remove <package-name>
```

### 주의사항
```bash
# 🚫 금지된 명령어들 (CLAUDE.md 지침)
pnpm dev    # 개발서버 실행 금지
pnpm build  # 빌드 금지
pnpm start  # 서버 실행 금지
```

## 테스트 (Vitest)

### 기본 테스트
```bash
# 테스트 실행
pnpm test

# 테스트 UI 실행
pnpm test:ui

# 테스트 감시 모드
pnpm test:watch

# 테스트 커버리지
pnpm test:coverage
```

### 특정 테스트
```bash
# 파일별 테스트
pnpm test -- posts.test.ts

# 패턴 테스트
pnpm test -- --grep "태그 그래프"
```

## 코드 품질 (Biome)

### 코드 검사 및 포맷팅
```bash
# 코드 검사
pnpm biome:check

# 자동 수정
pnpm biome:fix

# 스테이지된 파일만 수정
pnpm biome:staged
```

### TypeScript 타입 검사
```bash
# 타입 검사
pnpm type

# 타입 검사 (감시 모드)
pnpm type -- --watch
```

## 디버깅 및 분석

### 프로젝트 상태 확인
```bash
# 의존성 트리
pnpm list

# 보안 취약점 검사
pnpm audit

# 디스크 사용량
du -sh node_modules/ out/
```

### 파일 검색
```bash
# 파일 찾기
find src/ -name "*.tsx" -type f

# 내용 검색
grep -r "getRelatedPostsByTags" src/
```

## Git 워크플로우

### 브랜치 작업
```bash
# 기능 브랜치 생성
git checkout -b feature/new-feature

# 변경사항 확인
git status
git diff

# 커밋
git add .
git commit -m "feat: 새로운 기능 추가"
```

## 문제 해결

### 캐시 정리
```bash
# pnpm 캐시 정리
pnpm store prune

# TypeScript 캐시 정리
rm -rf node_modules/.cache
```

### 의존성 재설치
```bash
# node_modules 정리 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 포트 충돌 해결
```bash
# 포트 사용 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

## 빌드 결과 확인

### 정적 사이트 분석
```bash
# 빌드 결과 확인 (out/ 디렉토리)
ls -la out/

# 파일 크기 확인
find out/ -name "*.js" -exec ls -lh {} \; | sort -k5 -h
```

## 유용한 스크립트

### 개발 환경 설정
```bash
#!/bin/bash
# 개발 환경 초기화
pnpm install
pnpm type
pnpm biome:check
pnpm test
echo "✅ 개발 환경 준비 완료"
```

### 코드 품질 검사
```bash
#!/bin/bash
# 코드 품질 전체 검사
pnpm biome:check || exit 1
pnpm type || exit 1
pnpm test || exit 1
echo "✅ 코드 품질 검사 통과"
```