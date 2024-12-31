'use client'

import { useEffect } from 'react'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useOAuthTokens } from '@privy-io/react-auth'
import { getToken, refreshToken } from '@/services/instagram'

export function useOAuth() {
  const { nextAuth } = useLoginStatus()

  const { reauthorize } = useOAuthTokens({
    onOAuthTokenGrant({ oAuthTokens, user }) {
      if (oAuthTokens.provider === 'instagram') {
        getToken(oAuthTokens.accessToken).catch(console.error)
      }
    },
  })

  useEffect(() => {
    if (nextAuth) {
      // Do nothing
      refreshToken().catch(() => {})
    }
  }, [nextAuth])

  return reauthorize
}
