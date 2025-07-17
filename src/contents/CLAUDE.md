# src/contents/ MDX 콘텐츠 관리

@/CLAUDE.md

블로그 포스트 원본 파일들과 카테고리 메타데이터를 관리하는 영역입니다.

## 역할과 목적

**순수 콘텐츠 저장소**로서 MDX 포스트 파일과 카테고리 설정을 관리합니다. 도메인 레이어에서 이 파일들을 읽어 비즈니스 객체로 변환하며, UI 레이어에서 동적으로 import하여 렌더링합니다.

## 구조

```
src/contents/
├── dev/              # 개발 카테고리
│   ├── category.json # 카테고리 메타데이터
│   └── *.mdx        # 개발 관련 포스트들
└── life/            # 일상 카테고리  
    ├── category.json # 카테고리 메타데이터
    └── *.mdx        # 일상 관련 포스트들
```

## 핵심 규칙

### MDX 파일 구조
모든 포스트는 frontmatter + 마크다운 콘텐츠로 구성됩니다. frontmatter는 도메인 타입과 일치해야 하며, 파일명이 포스트 slug가 됩니다.

### 카테고리 관리
각 카테고리 디렉토리에는 `category.json` 파일이 필요합니다. 이 파일은 카테고리의 표시명, 설명, 색상, 아이콘을 정의합니다.

### 네이밍 규칙
- 파일명: 영문/숫자/하이픈만 사용 (한국어 지양)
- slug: 파일명과 frontmatter의 slug 일치 필수
- 카테고리: 디렉토리명이 카테고리 ID

## 다른 영역과의 관계

- **src/domain/**: 이 영역의 파일들을 읽어 도메인 객체로 변환
- **src/app/**: 동적 MDX import로 콘텐츠 렌더링
- **빌드 시스템**: gray-matter로 frontmatter 파싱, rehype-pretty-code로 구문 강조

## 작업 시 주의사항

- frontmatter 필수 필드 누락 금지 (title, date, tags, description)
- 날짜 형식 준수 (YYYY-MM-DD)
- 태그는 배열 형식으로 작성
- 새 카테고리 추가 시 category.json 생성 필수