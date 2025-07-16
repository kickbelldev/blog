import { describe, expect, it } from 'vitest'

import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('should format ISO date string to Korean format', () => {
    const isoDate = '2025-01-15'
    const result = formatDate(isoDate)
    expect(result).toBe('2025. 1. 15')
  })

  it('should format Date object to Korean format', () => {
    const date = new Date('2025-12-25')
    const result = formatDate(date)
    expect(result).toBe('2025. 12. 25')
  })

  it('should handle single digit months and days', () => {
    const isoDate = '2025-03-05'
    const result = formatDate(isoDate)
    expect(result).toBe('2025. 3. 5')
  })

  it('should return original string for invalid date', () => {
    const invalidDate = 'invalid-date'
    const result = formatDate(invalidDate)
    expect(result).toBe('invalid-date')
  })
})
