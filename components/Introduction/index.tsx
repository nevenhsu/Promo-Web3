'use client'

import { useRouter } from '@/navigation'
import { useSearchParams } from 'next/navigation'
import { usePromo } from '@/hooks/usePromo'
import useLogin from '@/hooks/useLogin'
import { useAppSelector } from '@/hooks/redux'
import { Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

export default function Index() {
  const router = useRouter()
  const { _id } = useAppSelector(state => state.user)
  const searchParams = useSearchParams()
  const promo = usePromo()

  const { login, authenticated } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // If the user was already authenticated, do nothing
      if (wasAlreadyAuthenticated) return

      // If the user is new and has a promo code, redirect to the referral code page
      if (isNewUser && promo) {
        router.push('/refer/code')
        return
      } else if (isNewUser) {
        router.push('/activity')
        return
      }

      // handle auth callbackUrl
      const callbackUrl = searchParams.get('callbackUrl')
      const callbackPath = getPathBeforeQuery(callbackUrl)
      if (callbackPath) {
        router.push(callbackPath)
        return
      }

      router.push('/home')
    },
  })

  const handleClick = () => {
    if (authenticated && _id) {
      router.push('/home')
      return
    }

    login()
  }

  return (
    <RwdLayout>
      <Button onClick={handleClick}>Get Started</Button>
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
