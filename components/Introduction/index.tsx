'use client'

import { useRouter } from '@/navigation'
import useLogin from '@/hooks/useLogin'
import { Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

export default function Index() {
  const router = useRouter()
  const { login, authenticated } = useLogin({
    onComplete: () => {
      router.push('/home')
    },
  })

  const handleClick = () => {
    if (authenticated) {
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
