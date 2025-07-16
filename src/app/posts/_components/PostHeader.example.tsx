// This is an example file showing how to use the PostHeader component
// This file is for demonstration purposes and can be removed after verification

import { PostHeader } from './PostHeader'

export function PostHeaderExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PostHeader
        title="App Router에서 getStaticParams와 404 페이지 처리하기"
        date="2025-07-14"
        tags={[
          'Next.js',
          'App Router',
          '404',
        ]}
        readingTime={8}
        author="블로그 작성자"
      />

      <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          PostHeader 컴포넌트 특징:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-600 dark:text-stone-400">
          <li>한국어 날짜 포맷팅 (formatDate 유틸리티 사용)</li>
          <li>
            반응형 레이아웃 (모바일에서 세로 배치, 데스크톱에서 가로 배치)
          </li>
          <li>다크 모드 지원</li>
          <li>태그에 # 접두사 추가</li>
          <li>읽기 시간 및 작성자 정보 선택적 표시</li>
          <li>접근성 고려 (시맨틱 HTML, ARIA 속성)</li>
        </ul>
      </div>
    </div>
  )
}
