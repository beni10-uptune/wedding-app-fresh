interface Window {
  gtag?: (
    command: 'event' | 'config' | 'js',
    targetId: string,
    config?: {
      description?: string
      fatal?: boolean
      [key: string]: any
    }
  ) => void
}