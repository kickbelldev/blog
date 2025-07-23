# 개발 가이드라인

## 필수 원칙

### 도메인 API 사용
- ✅ `import { getCategoryById } from '@/domain/blog'`
- ❌ 직접 파일 시스템 접근 금지

### 타입 안전성
- ✅ 모든 Props 인터페이스 명시
- ❌ `any` 타입 사용 금지
- ✅ 도메인 타입 재사용 (`CategoryId`, `Post`, `Tag`)

### 아키텍처 구조
- **도메인 로직**: `src/domain/blog/` 통합
- **UI 컴포넌트**: `src/app/` 분리  
- **모듈 레벨 캐싱**: 빌드 타임 데이터 사전 로드

## 콘텐츠 구조

### MDX 파일
```
src/contents/
├── dev/category.json + *.mdx
└── life/category.json + *.mdx
```

### frontmatter 필수 필드
```yaml
title: '포스트 제목'
date: 2025-01-17
tags: ['tag1', 'tag2']
category: 'dev' # 또는 'life'
```

## 품질 체크리스트

### 컴포넌트 작성시
- [ ] Props 인터페이스 정의
- [ ] 서버 컴포넌트 우선 (상호작용 필요시만 클라이언트)
- [ ] `cn()` 유틸리티로 클래스 병합

### 데이터 처리시  
- [ ] 도메인 API 함수 사용
- [ ] 타입 안전성 보장
- [ ] 빌드 타임 사전 계산 활용

### 성능 최적화
- [ ] `generateStaticParams()` 정적 경로 생성
- [ ] 컴포넌트 간 props 최소화
- [ ] 모듈 레벨 캐싱 활용