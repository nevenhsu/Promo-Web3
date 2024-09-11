'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from '@/navigation'
import { useLogin as _useLogin } from '@privy-io/react-auth'
import { usePrivy } from '@privy-io/react-auth'
import { usePromo } from '@/hooks/usePromo'
import { useCallbackUrl } from '@/hooks/useCallbackUrl'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import type { User, CallbackError } from '@privy-io/react-auth'

type CallbackComplete = (user: User, isNewUser: boolean, wasAlreadyAuthenticated: boolean) => void

type LoginValue = {
  onComplete?: CallbackComplete
  onError?: CallbackError
}

export default function useLogin(val?: LoginValue) {
  const { onComplete, onError } = val || {}
  const { ready, authenticated } = usePrivy()

  const { login } = _useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // TODO: switch network
      if (onComplete) {
        onComplete(user, isNewUser, wasAlreadyAuthenticated)
      }
    },
    onError: err => {
      if (onError) {
        onError(err)
      }
    },
  })

  return { login, authenticated }
}

export function useClickLogin() {
  const router = useRouter()
  const pathname = usePathname()
  const promo = usePromo()
  const { callbackPath } = useCallbackUrl()
  const { bothAuth, privyAuth, loading } = useLoginStatus()
  const [nextPage, setNextPage] = useState<string>()

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // If the user is new and has a promo code, redirect to the referral code page
      if (isNewUser && promo) {
        promo ? setNextPage('/refer/code') : setNextPage('/activity')
        return
      }

      if (callbackPath) {
        setNextPage(callbackPath)
        return
      }

      if (!wasAlreadyAuthenticated) {
        setNextPage('/activity')
      }
    },
  })

  const clickLogin = () => {
    if (privyAuth) {
      setNextPage(callbackPath || '/activity')
      return
    }

    login()
  }

  useEffect(() => {
    // Redirect to the next page if the user logs in
    if (nextPage && bothAuth) {
      // @ts-ignore
      router.push(nextPage)
    }
  }, [nextPage, bothAuth])

  useEffect(() => {
    // Clear the next page if the user navigates to it
    if (nextPage && pathname.startsWith(nextPage)) {
      setNextPage(undefined)
    }
  }, [nextPage, pathname])

  // TODO: remove this debugging
  console.log({
    bothAuth,
    privyAuth,
    loading,
    nextPage,
    callbackPath,
  })

  return { clickLogin, loading: loading || (Boolean(nextPage) && privyAuth) }
}
