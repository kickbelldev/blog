import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.locale('ko')

/**
 * Formats a date string to format (YYYY M D)
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Formatted date string (YYYY M D)
 */
export function formatDate(dateString: string | Date): string {
  const date = dayjs(dateString)

  // Check if date is valid
  if (!date.isValid()) {
    return dateString.toString()
  }

  return date.format('YYYY. M. D')
}
