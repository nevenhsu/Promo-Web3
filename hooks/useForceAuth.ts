'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import useLogin from './useLogin'

export default function useForceAuth() {
  const [t, setT] = useState(Date.now())
  const { ready, authenticated, user } = usePrivy()

  const pathname = usePathname()
  const atHome = pathname === '/'

  // pathname: /u/id/subPath
  const atU = pathname.startsWith('/u/')
  const [, u, id, subPath] = atU ? pathname.split('/') : []

  const notAuth = ready && !authenticated
  const noAuth = atHome || (atU && !subPath)

  const { login } = useLogin({
    onError: () => {
      // refresh to force login
      setT(Date.now())
    },
  })

  useEffect(() => {
    if (!noAuth && notAuth) {
      login()
    }
  }, [t, noAuth, notAuth])
}
