import { describe, expect, it } from 'vitest'

import { formatDate, formatRelativeDate } from './formatDate'

describe('formatDate', () => {
  it('should format ISO date string to Korean format', () => {
    const isoDate = '2025-01-15'
    const result = formatDate(isoDate)
    expect(result).toBe('2025년 1월 15일')
  })

  it('should format Date object to Korean format', () => {
    const date = new Date('2025-12-25')
    const result = formatDate(date)
    expect(result).toBe('2025년 12월 25일')
  })

  it('should handle single digit months and days', () => {
    const isoDate = '2025-03-05'
    const result = formatDate(isoDate)
    expect(result).toBe('2025년 3월 5일')
  })

  it('should return original string for invalid date', () => {
    const invalidDate = 'invalid-date'
    const result = formatDate(invalidDate)
    expect(result).toBe('invalid-date')
  })
})

describe('formatRelativeDate', () => {
  it('should return "오늘" for today', () => {
    const today = new Date()
    const result = formatRelativeDate(today)
    expect(result).toBe('오늘')
  })

  it('should return "어제" for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const result = formatRelativeDate(yesterday)
    expect(result).toBe('어제')
  })

  it('should return days for recent dates', () => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const result = formatRelativeDate(threeDaysAgo)
    expect(result).toBe('3일 전')
  })

  it('should return weeks for dates within a month', () => {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const result = formatRelativeDate(twoWeeksAgo)
    expect(result).toBe('2주일 전')
  })
})
