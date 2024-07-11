'use client'

import { useEffect } from 'react'
import { useRouter } from '@/navigation'
import { useSession } from 'next-auth/react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  const authenticated = status === 'authenticated'

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to index if not authenticated
      router.push('/')
    }
  }, [status])

  return <>{authenticated ? <>{children}</> : <></>}</>
}
