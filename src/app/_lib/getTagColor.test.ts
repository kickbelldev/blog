import { describe, expect, it } from 'vitest'

import { getTagColor } from './getTagColor'

describe('getTagColor', () => {
  it('should return consistent colors for the same tag', () => {
    const tag = 'javascript'
    const color1 = getTagColor(tag)
    const color2 = getTagColor(tag)

    expect(color1).toBe(color2)
  })

  it('should return a valid CSS class string', () => {
    const color = getTagColor('react')

    expect(color).toMatch(
      /^bg-\w+-\d+\s+text-\w+-\d+\s+dark:bg-\w+-\d+\s+dark:text-\w+-\d+$/
    )
  })

  it('should handle empty string', () => {
    const color = getTagColor('')

    expect(color).toBeTruthy()
    expect(typeof color).toBe('string')
  })
})
