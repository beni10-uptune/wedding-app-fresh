import { Suspense } from 'react'
import { GoogleTagManager } from './GoogleTagManager'

interface GoogleTagManagerWrapperProps {
  gtmId: string
}

export function GoogleTagManagerWrapper({ gtmId }: GoogleTagManagerWrapperProps) {
  return (
    <Suspense fallback={null}>
      <GoogleTagManager gtmId={gtmId} />
    </Suspense>
  )
}