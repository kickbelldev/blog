// 테스트 설정 파일
import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock file system operations for testing
vi.mock('node:fs/promises', () => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
}))

// Mock process.cwd() for consistent paths
vi.mock('node:path', async () => {
  const actual = await vi.importActual('node:path')
  return {
    ...actual,
    join: vi.fn((...args: string[]) => args.join('/')),
  }
})

// Mock gray-matter for consistent parsing
vi.mock('gray-matter', () => ({
  default: vi.fn(),
}))
