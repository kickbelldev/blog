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

