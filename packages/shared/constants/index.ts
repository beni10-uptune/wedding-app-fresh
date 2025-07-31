/**
 * Shared constants for all Uptune applications
 */

export const APP_NAME = 'Uptune'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
} as const

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USER: '/api/user',
  SPOTIFY: '/api/spotify',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'uptune_auth_token',
  USER_PREFERENCES: 'uptune_user_prefs',
  THEME: 'uptune_theme',
} as const

export const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_SONG_NAME_LENGTH: 100,
  MAX_PLAYLIST_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
} as const

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9-]+$/,
} as const