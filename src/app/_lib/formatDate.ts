/**
 * Formats a date string to Korean format
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Formatted date string in Korean format (YYYY년 M월 D일)
 */
export function formatDate(dateString: string | Date): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString

  // Check if date is valid
  if (Number.isNaN(date.getTime())) {
    return dateString.toString()
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}년 ${month}월 ${day}일`
}

/**
 * Formats a date string to relative time (e.g., "2일 전", "1주일 전")
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Relative time string in Korean
 */
export function formatRelativeDate(dateString: string | Date): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return '오늘'
  } else if (diffInDays === 1) {
    return '어제'
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks}주일 전`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months}개월 전`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `${years}년 전`
  }
}
