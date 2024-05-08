'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import useLogin from './useLogin'

export default function useForceAuth() {
  const [t, setT] = useState(Date.now())
  const { ready, authenticated } = usePrivy()

  const pathname = usePathname()

  const notAuth = ready && !authenticated
  const skipAuth = pathname === '/'
  const needAuth = notAuth && !skipAuth

  const open = useCallback(() => setT(Date.now()), [])

  const { login } = useLogin({
    onError: () => {
      open()
    },
  })

  useEffect(() => {
    if (needAuth) {
      login()
    }
  }, [t, needAuth])

  return { authenticated: !needAuth, open }
}
