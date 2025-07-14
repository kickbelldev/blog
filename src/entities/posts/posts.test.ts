import { readdir, readFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getAllPosts, getPostByFileName, getPostFileNames } from './index'

// Mock dependencies
vi.mock('node:fs/promises')
vi.mock('node:path', () => ({
  join: vi.fn((...args: string[]) => args.join('/')),
}))
vi.mock('gray-matter')

const mockReaddir = vi.mocked(readdir)
const mockReadFile = vi.mocked(readFile)
const mockMatter = vi.mocked(matter)

describe('Posts Entity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPostFileNames', () => {
    it('should return only .mdx files', async () => {
      mockReaddir.mockResolvedValue([
        'post1.mdx',
        'post2.mdx',
        'README.md',
        'config.json',
        'post3.mdx',
      ] as any)

      const result = await getPostFileNames()

      expect(result).toEqual([
        'post1.mdx',
        'post2.mdx',
        'post3.mdx',
      ])
      expect(mockReaddir).toHaveBeenCalledWith(
        '/home/kayce/dev/blog/src/contents'
      )
    })

    it('should return empty array when no .mdx files', async () => {
      mockReaddir.mockResolvedValue([
        'README.md',
        'config.json',
      ] as any)

      const result = await getPostFileNames()

      expect(result).toEqual([])
    })
  })

  describe('getPostByFileName', () => {
    it('should parse MDX file with frontmatter correctly', async () => {
      const mockFileContent = `---
title: 'Test Post'
date: 2025-01-01
tags: ['test', 'example']
---

# Test Content

This is a test post.`

      mockReadFile.mockResolvedValue(mockFileContent)
      mockMatter.mockReturnValue({
        content: '\n# Test Content\n\nThis is a test post.',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
            'example',
          ],
        },
      } as any)

      const result = await getPostByFileName('test-post.mdx')

      expect(result).toEqual({
        content: '\n# Test Content\n\nThis is a test post.',
        data: {
          title: 'Test Post',
          date: '2025-01-01',
          tags: [
            'test',
            'example',
          ],
        },
        slug: 'test-post',
      })
      expect(mockReadFile).toHaveBeenCalledWith(
        '/home/kayce/dev/blog/src/contents/test-post.mdx',
        'utf-8'
      )
    })

    it('should handle empty frontmatter', async () => {
      const mockFileContent = `---
---

# Only Content

No frontmatter data.`

      mockReadFile.mockResolvedValue(mockFileContent)
      mockMatter.mockReturnValue({
        content: '\n# Only Content\n\nNo frontmatter data.',
        data: {},
      } as any)

      const result = await getPostByFileName('empty-frontmatter.mdx')

      expect(result.slug).toBe('empty-frontmatter')
      expect(result.content).toContain('# Only Content')
      expect(result.data).toEqual({})
    })

    it('should handle file without frontmatter', async () => {
      const mockFileContent = `# Just Content

No frontmatter at all.`

      mockReadFile.mockResolvedValue(mockFileContent)
      mockMatter.mockReturnValue({
        content: mockFileContent,
        data: {},
      } as any)

      const result = await getPostByFileName('no-frontmatter.mdx')

      expect(result.slug).toBe('no-frontmatter')
      expect(result.content).toBe(mockFileContent)
      expect(result.data).toEqual({})
    })
  })

  describe('getAllPosts', () => {
    it('should return all posts sorted by date (newest first)', async () => {
      mockReaddir.mockResolvedValue([
        'post1.mdx',
        'post2.mdx',
        'post3.mdx',
      ] as any)

      mockReadFile
        .mockResolvedValueOnce('file1')
        .mockResolvedValueOnce('file2')
        .mockResolvedValueOnce('file3')

      mockMatter
        .mockReturnValueOnce({
          content: 'Old content',
          data: {
            title: 'Old Post',
            date: '2025-01-01',
            tags: [
              'old',
            ],
          },
        } as any)
        .mockReturnValueOnce({
          content: 'New content',
          data: {
            title: 'New Post',
            date: '2025-01-03',
            tags: [
              'new',
            ],
          },
        } as any)
        .mockReturnValueOnce({
          content: 'Middle content',
          data: {
            title: 'Middle Post',
            date: '2025-01-02',
            tags: [
              'middle',
            ],
          },
        } as any)

      const result = await getAllPosts()

      expect(result).toHaveLength(3)
      expect(result[0].data.title).toBe('New Post')
      expect(result[1].data.title).toBe('Middle Post')
      expect(result[2].data.title).toBe('Old Post')
    })

    it('should handle posts with invalid date format', async () => {
      mockReaddir.mockResolvedValue([
        'post1.mdx',
        'post2.mdx',
      ] as any)

      mockReadFile.mockResolvedValueOnce('file1').mockResolvedValueOnce('file2')

      mockMatter
        .mockReturnValueOnce({
          content: 'Content 1',
          data: {
            title: 'Post 1',
            date: 'invalid-date',
            tags: [
              'test',
            ],
          },
        } as any)
        .mockReturnValueOnce({
          content: 'Content 2',
          data: {
            title: 'Post 2',
            date: '2025-01-01',
            tags: [
              'test',
            ],
          },
        } as any)

      const result = await getAllPosts()

      expect(result).toHaveLength(2)
      // Should handle invalid date gracefully - both posts should be returned
      expect(result.map((p) => p.data.title)).toContain('Post 1')
      expect(result.map((p) => p.data.title)).toContain('Post 2')
    })

    it('should handle empty directory', async () => {
      mockReaddir.mockResolvedValue([] as any)

      const result = await getAllPosts()

      expect(result).toEqual([])
    })

    it('should handle posts with same date', async () => {
      mockReaddir.mockResolvedValue([
        'post1.mdx',
        'post2.mdx',
      ] as any)

      mockReadFile.mockResolvedValueOnce('file1').mockResolvedValueOnce('file2')

      mockMatter
        .mockReturnValueOnce({
          content: 'Content A',
          data: {
            title: 'Post A',
            date: '2025-01-01',
          },
        } as any)
        .mockReturnValueOnce({
          content: 'Content B',
          data: {
            title: 'Post B',
            date: '2025-01-01',
          },
        } as any)

      const result = await getAllPosts()

      expect(result).toHaveLength(2)
      // Should maintain stable sort order
      expect(result.map((p) => p.data.title)).toEqual([
        'Post A',
        'Post B',
      ])
    })
  })
})
