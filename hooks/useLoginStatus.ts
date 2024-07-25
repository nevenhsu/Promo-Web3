'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useSession } from 'next-auth/react'

export function useLoginStatus() {
  const { authenticated: privyAuth, ready } = usePrivy()
  const { status } = useSession()

  const loading = !ready || status === 'loading'

  const nextAuth = status === 'authenticated'
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
