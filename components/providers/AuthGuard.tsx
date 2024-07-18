'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from '@/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useSession } from 'next-auth/react'
import { isPublicPage } from '@/middleware'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { ready, authenticated } = usePrivy()
  const { status } = useSession()

  const isPublic = isPublicPage(pathname)
  const authOnServer = status === 'authenticated'
  const authOnBoth = authOnServer && authenticated
  const notAuthOnPrivy = ready && !authenticated

  useEffect(() => {
    if (isPublic) {
      return
    }

    if (notAuthOnPrivy) {
      // Redirect to index if not authenticated
      router.push('/')
    }
  }, [isPublic, notAuthOnPrivy])

  // TODO: show loading screen
  return <>{isPublic || authOnBoth ? <>{children}</> : <></>}</>
}
