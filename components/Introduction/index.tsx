'use client'

import { useRouter } from '@/navigation'
import { useSearchParams } from 'next/navigation'
import { usePromo } from '@/hooks/usePromo'
import useLogin from '@/hooks/useLogin'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

export default function Index() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { bothAuth, loading } = useLoginStatus()
  const promo = usePromo()

  // Get the callback URL from the url query params
  const callbackUrl = searchParams.get('callbackUrl')
  const callbackPath = getPathBeforeQuery(callbackUrl)

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // If the user is new and has a promo code, redirect to the referral code page
      if (isNewUser && promo) {
        promo ? router.push('/refer/code') : router.push('/activity')
        return
      }

      if (callbackPath) {
        router.push(callbackPath)
        return
      }

      if (!wasAlreadyAuthenticated) {
        router.push('/home')
        return
      }
    },
  })

  const handleClick = () => {
    if (bothAuth) {
      const nextUrl = callbackPath || '/home'
      router.push(nextUrl)
      router.refresh()
      return
    }

    login()
  }

  return (
    <RwdLayout>
      <Button onClick={handleClick} loading={loading}>
        Get Started
      </Button>
    </RwdLayout>
  )
}

function getPathBeforeQuery(cb: string | null): any {
  if (!cb) return

  const questionMarkIndex = cb.indexOf('?')
  if (questionMarkIndex === -1) {
    return cb // If there is no ?, return the whole string
  }
  return cb.substring(0, questionMarkIndex)
}
