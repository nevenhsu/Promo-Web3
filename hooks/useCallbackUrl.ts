'use client'

import { useSearchParams } from 'next/navigation'

export function useCallbackUrl() {
  // Get the callback URL from the url query params
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const callbackPath = getPathBeforeQuery(callbackUrl)

  return { callbackPath }
}

function getPathBeforeQuery(cb: string | null): any {
  if (!cb || !cb.startsWith('/')) return

  const questionMarkIndex = cb.indexOf('?')
  if (questionMarkIndex === -1) {
    return cb // If there is no ?, return the whole string
  }
  return cb.substring(0, questionMarkIndex)
}
