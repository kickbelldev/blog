# Design Document

## Overview

포스트 페이지 레이아웃 개선은 현재의 기본적인 MDX 렌더링에서 체계적이고 사용자 친화적인 블로그 포스트 경험으로 발전시키는 것을 목표로 합니다. 이 설계는 Next.js 15 App Router, MDX, Tailwind CSS, shadcn/ui를 활용하여 성능과 사용자 경험을 모두 고려한 솔루션을 제공합니다.

## Architecture

### 컴포넌트 계층 구조

```
PostPage (src/app/posts/[slug]/page.tsx)
├── PostHeader
│   ├── PostTitle
│   ├── PostMeta (date, tags)
│   └── PostActions (share, bookmark)
├── PostContent
│   ├── TableOfContents (optional)
│   └── MDXContent (prose styling)
├── PostFooter
│   ├── PostNavigation (prev/next)
│   ├── RelatedPosts
│   ├── AuthorInfo
│   └── SocialShare
└── PostSEO (metadata, JSON-LD)
```

### 데이터 흐름

1. **Static Generation**: `generateStaticParams()`로 모든 포스트 경로 생성
2. **Post Data Fetching**: 기존 `src/entities/posts` 활용하여 포스트 데이터 가져오기
3. **MDX Rendering**: 동적 import로 MDX 컴포넌트 로드
4. **Metadata Generation**: `generateMetadata()`로 SEO 메타데이터 생성

## Components and Interfaces

### PostHeader 컴포넌트

```typescript
interface PostHeaderProps {
  title: string
  date: string
  tags: string[]
  readingTime?: number
}

export function PostHeader({ title, date, tags, readingTime }: PostHeaderProps) {
  return (
    <header className="mb-8 pb-8 border-b border-stone-200">
      <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-stone-600">
        <time dateTime={date} className="text-sm">
          {formatDate(date)}
        </time>
        {readingTime && (
          <span className="text-sm">약 {readingTime}분 읽기</span>
        )}
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </header>
  )
}
```

### PostContent 컴포넌트

```typescript
interface PostContentProps {
  children: React.ReactNode
  showTOC?: boolean
  headings?: Heading[]
}

export function PostContent({ children, showTOC, headings }: PostContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {showTOC && headings && (
        <aside className="lg:col-span-1">
          <TableOfContents headings={headings} />
        </aside>
      )}
      <article className={cn(
        "prose prose-stone max-w-none",
        showTOC ? "lg:col-span-3" : "lg:col-span-4"
      )}>
        {children}
      </article>
    </div>
  )
}
```

### PostNavigation 컴포넌트

```typescript
interface PostNavigationProps {
  previousPost?: {
    slug: string
    title: string
  }
  nextPost?: {
    slug: string
    title: string
  }
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  return (
    <nav className="flex justify-between items-center py-8 border-t border-stone-200">
      {previousPost ? (
        <Link href={`/posts/${previousPost.slug}`} className="group">
          <div className="text-sm text-stone-500 mb-1">이전 글</div>
          <div className="font-medium group-hover:text-stone-600">
            {previousPost.title}
          </div>
        </Link>
      ) : <div />}
      
      {nextPost ? (
        <Link href={`/posts/${nextPost.slug}`} className="group text-right">
          <div className="text-sm text-stone-500 mb-1">다음 글</div>
          <div className="font-medium group-hover:text-stone-600">
            {nextPost.title}
          </div>
        </Link>
      ) : <div />}
    </nav>
  )
}
```

### RelatedPosts 컴포넌트

```typescript
interface RelatedPostsProps {
  posts: Array<{
    slug: string
    title: string
    date: string
    tags: string[]
  }>
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null
  
  return (
    <section className="py-8 border-t border-stone-200">
      <h3 className="text-xl font-semibold text-stone-900 mb-4">
        관련 글
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <Card key={post.slug}>
            <CardContent className="p-4">
              <Link href={`/posts/${post.slug}`}>
                <h4 className="font-medium hover:text-stone-600 mb-2">
                  {post.title}
                </h4>
                <time className="text-sm text-stone-500">
                  {formatDate(post.date)}
                </time>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

## Data Models

### Post 타입 확장

```typescript
// src/entities/posts/types.ts 확장
export type PostFrontMatter = {
  title: string
  date: string
  tags: Array<string>
  description?: string
  author?: string
  readingTime?: number
  featured?: boolean
}

export type PostWithNavigation = Post & {
  previousPost?: Pick<Post, 'slug' | 'data'>
  nextPost?: Pick<Post, 'slug' | 'data'>
  relatedPosts?: Array<Pick<Post, 'slug' | 'data'>>
}

export type Heading = {
  id: string
  text: string
  level: number
}
```

### 메타데이터 타입

```typescript
export type PostMetadata = {
  title: string
  description: string
  openGraph: {
    title: string
    description: string
    type: 'article'
    publishedTime: string
    authors: string[]
    tags: string[]
  }
  twitter: {
    card: 'summary_large_image'
    title: string
    description: string
  }
}
```

## Error Handling

### 에러 시나리오 및 처리

1. **포스트 파일 없음**
   - `notFound()` 함수 호출하여 404 페이지 표시
   - 사용자에게 명확한 에러 메시지 제공

2. **MDX 파싱 에러**
   - try-catch로 에러 캐치
   - 개발 환경에서는 상세 에러 로그
   - 프로덕션에서는 일반적인 에러 메시지

3. **관련 포스트 로딩 실패**
   - 관련 포스트 섹션 숨김
   - 메인 콘텐츠는 정상 표시

```typescript
// 에러 처리 예시
export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) {
      notFound()
    }
    
    const { default: MDXContent } = await import(`@/contents/${post.slug}.mdx`)
    
    return (
      <PostLayout post={post}>
        <MDXContent />
      </PostLayout>
    )
  } catch (error) {
    console.error('Post loading error:', error)
    notFound()
  }
}
```

## Testing Strategy

### 단위 테스트

1. **유틸리티 함수 테스트**
   - `formatDate()` 함수
   - `calculateReadingTime()` 함수
   - `extractHeadings()` 함수

2. **컴포넌트 테스트**
   - PostHeader 렌더링 테스트
   - PostNavigation 링크 테스트
   - RelatedPosts 표시 테스트

### 통합 테스트

1. **페이지 렌더링 테스트**
   - 포스트 페이지 전체 렌더링
   - 메타데이터 생성 확인
   - SEO 태그 검증

2. **반응형 테스트**
   - 모바일/데스크톱 레이아웃 확인
   - 터치 인터랙션 테스트

### 성능 테스트

1. **로딩 성능**
   - 페이지 로드 시간 측정
   - 이미지 최적화 확인
   - 코드 분할 효과 검증

2. **SEO 검증**
   - Lighthouse SEO 점수
   - 구조화된 데이터 검증
   - 메타 태그 완성도 확인

## Performance Considerations

### 최적화 전략

1. **정적 생성 최적화**
   - 모든 포스트 페이지 빌드 타임 생성
   - 메타데이터 사전 생성
   - 관련 포스트 계산 최적화

2. **이미지 최적화**
   - Next.js Image 컴포넌트 사용
   - 적절한 크기와 포맷 제공
   - 지연 로딩 적용

3. **코드 분할**
   - MDX 컴포넌트 동적 로딩
   - 필요한 컴포넌트만 로드
   - 번들 크기 최소화

### 접근성 고려사항

1. **시맨틱 HTML**
   - 적절한 heading 계층구조
   - article, section, nav 태그 활용
   - 스크린 리더 친화적 구조

2. **키보드 네비게이션**
   - 모든 인터랙티브 요소 접근 가능
   - 포커스 표시 명확히
   - 논리적인 탭 순서

3. **색상 대비**
   - WCAG 가이드라인 준수
   - 다크 모드 지원
   - 색상에 의존하지 않는 정보 전달

## SEO Optimization

### 메타데이터 최적화

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }
  
  return {
    title: post.data.title,
    description: post.data.description || extractExcerpt(post.content),
    openGraph: {
      title: post.data.title,
      description: post.data.description || extractExcerpt(post.content),
      type: 'article',
      publishedTime: post.data.date,
      authors: [post.data.author || 'Blog Author'],
      tags: post.data.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.data.title,
      description: post.data.description || extractExcerpt(post.content),
    }
  }
}
```

### 구조화된 데이터

```typescript
function generateJSONLD(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    author: {
      '@type': 'Person',
      name: post.data.author || 'Blog Author'
    },
    datePublished: post.data.date,
    keywords: post.data.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/posts/${post.slug}`
    }
  }
}
```