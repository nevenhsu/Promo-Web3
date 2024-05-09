'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import useLogin from './useLogin'

export default function useForceAuth() {
  const [t, setT] = useState(Date.now())
  const { ready, authenticated } = usePrivy()

  const notAuth = ready && !authenticated
  const skip = skipAuth(usePathname())
  const needAuth = notAuth && !skip

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

function skipAuth(pathname: string) {
  if (pathname === '/') {
    return true
  }

  if (pathname.startsWith('/activity')) {
    return true
  }

  return false
}
