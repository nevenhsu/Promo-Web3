'use client'

import { useRouter } from '@/navigation'
import useLogin from '@/hooks/useLogin'
import { useAppSelector } from '@/hooks/redux'
import { Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

export default function Index() {
  const router = useRouter()
  const { _id } = useAppSelector(state => state.user)
  const { login, authenticated } = useLogin({
    onComplete: () => {
      // TODO: handle auth callbackUrl
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
