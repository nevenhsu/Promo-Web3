'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useSession } from 'next-auth/react'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.isAdmin

  useEffect(() => {
    if (status === 'loading') return

    // Redirect to index if not admin
    if (!isAdmin) {
      router.push('/')
    }
  }, [status, isAdmin])

  return <>{isAdmin ? <>{children}</> : <></>}</>
}
