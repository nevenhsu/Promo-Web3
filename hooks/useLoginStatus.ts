'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useSession } from 'next-auth/react'

export function useLoginStatus() {
  const { authenticated: privyAuth, ready } = usePrivy()
  const { status, data: session } = useSession()
  const hasToken = Boolean(session?.user?.id)

  const loading = !ready || status === 'loading'

  const nextAuth = status === 'authenticated' && hasToken
  const bothAuth = privyAuth && nextAuth

  const privyAuthFail = !privyAuth && !loading
  const nextAuthFail = !nextAuth && !loading

  return {
    // privy
    privyAuth,
    privyAuthFail,
    // next
    nextAuth,
    nextAuthFail,
    // both
    bothAuth,
    loading,
  }
}
