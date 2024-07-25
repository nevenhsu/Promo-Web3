'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from '@/navigation'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { isPublicPage } from '@/middleware'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const { bothAuth, privyAuthFail } = useLoginStatus()

  const isPublic = isPublicPage(pathname)

  useEffect(() => {
    if (isPublic) {
      return
    }

    if (privyAuthFail) {
      // Redirect to index if not authenticated
      router.push('/')
    }
  }, [isPublic, privyAuthFail])

  // TODO: show loading screen
  return <>{isPublic || bothAuth ? <>{children}</> : <></>}</>
}
