import type { Heading } from '../types'

/**
 * MDX 콘텐츠에서 헤딩을 추출합니다.
 *
 * @param content - MDX 문자열 콘텐츠
 * @returns 추출된 헤딩 배열
 */
export function extractHeadingsFromMDX(content: string): Heading[] {
  const headings: Heading[] = []

  // MDX 헤딩 패턴 매칭 (# ## ### #### ##### ######)
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match: RegExpExecArray | null

  match = headingRegex.exec(content)
  while (match !== null) {
    const level = match[1].length // # 개수로 레벨 결정
    const text = match[2].trim()

    // 헤딩 텍스트에서 ID 생성 (kebab-case)
    const id = generateHeadingId(text)

    headings.push({
      id,
      text,
      level,
    })

    match = headingRegex.exec(content)
  }

  return headings
}

/**
 * 헤딩 텍스트에서 URL에 안전한 ID를 생성합니다.
 *
 * @param text - 헤딩 텍스트
 * @returns kebab-case 형식의 ID
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 영문, 숫자, 공백, 한글만 유지
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
    .replace(/-+/g, '-') // 연속된 하이픈 제거
    .replace(/^-|-$/g, '') // 시작/끝 하이픈 제거
}

/**
 * 헤딩 배열을 중첩된 트리 구조로 변환합니다.
 *
 * @param headings - 플랫한 헤딩 배열
 * @returns 중첩된 헤딩 트리
 */
export type HeadingTree = Heading & {
  children: HeadingTree[]
}

export function buildHeadingTree(headings: Heading[]): HeadingTree[] {
  const tree: HeadingTree[] = []
  const stack: HeadingTree[] = []

  for (const heading of headings) {
    const node: HeadingTree = {
      ...heading,
      children: [],
    }

    // 현재 헤딩 레벨보다 큰 레벨들을 스택에서 제거
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    // 스택이 비어있으면 루트 레벨
    if (stack.length === 0) {
      tree.push(node)
    } else {
      // 부모 노드의 자식으로 추가
      stack[stack.length - 1].children.push(node)
    }

    stack.push(node)
  }

  return tree
}
