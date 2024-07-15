'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from '@/navigation'
import { useSession } from 'next-auth/react'
import { isPublicPage } from '@/middleware'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const isPublic = isPublicPage(pathname)
  const authenticated = status === 'authenticated'

  useEffect(() => {
    if (isPublic) {
      return
    }

    if (status === 'unauthenticated') {
      // Redirect to index if not authenticated
      router.push('/')
    }
  }, [status, isPublic])

  return <>{isPublic || authenticated ? <>{children}</> : <></>}</>
}
