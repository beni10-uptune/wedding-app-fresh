/**
 * Shared date utilities for all Uptune applications
 */

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return d.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format a date to a short string (MM/DD/YYYY)
 */
export function formatDateShort(date: Date | string | number): string {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Format a date to include time
 */
export function formatDateTime(
  date: Date | string | number,
  includeSeconds = false
): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  }
  
  return d.toLocaleDateString('en-US', options)
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date)
  const now = new Date()
  const diffInMs = d.getTime() - now.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (Math.abs(diffInSeconds) < 60) {
    return 'just now'
  }
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute')
  }
  
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour')
  }
  
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day')
  }
  
  return formatDate(d)
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string | number): boolean {
  return new Date(date) < new Date()
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}