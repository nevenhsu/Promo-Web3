'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/navigation'
import { useSearchParams } from 'next/navigation'
import { usePromo } from '@/hooks/usePromo'
import useLogin from '@/hooks/useLogin'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { Button, Stack, Space, Box, Title, Text, Timeline } from '@mantine/core'
import Marquee from 'react-fast-marquee'
import RwdLayout from '@/components/share/RwdLayout'
import Animation from '@/components/Introduction/Animation'

export default function Index() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { bothAuth, privyAuth, loading } = useLoginStatus()
  const promo = usePromo()

  const [nextPage, setNextPage] = useState<string>()

  // Get the callback URL from the url query params
  const callbackUrl = searchParams.get('callbackUrl')
  const callbackPath = getPathBeforeQuery(callbackUrl)

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // If the user is new and has a promo code, redirect to the referral code page
      if (isNewUser && promo) {
        promo ? setNextPage('/refer/code') : setNextPage('/activity')
        return
      }

      if (callbackPath) {
        setNextPage(callbackPath)
        return
      }

      if (!wasAlreadyAuthenticated) {
        setNextPage('/activity')
        return
      }
    },
  })

  const handleClick = () => {
    if (privyAuth) {
      setNextPage(callbackPath || '/activity')
      return
    }

    login()
  }

  useEffect(() => {
    if (nextPage && bothAuth) {
      // @ts-ignore
      router.push(nextPage)
    }
  }, [nextPage, bothAuth])

  return (
    <>
      <RwdLayout pos="relative">
        <Box
          className="absolute-horizontal"
          style={{
            top: 0,
            width: '100%',
            height: 'calc(100vh - 64px)',
          }}
        >
          <Animation src="/images/peeps.png" rows={15} cols={7} />

          <Marquee>
            <Text bg="black" c="white" px="md" py="xs">
              🎉 Share 2 Earn – Turn Your Reposts into Cryptocurrency!
            </Text>
          </Marquee>
        </Box>
        <Box pos="relative">
          {/* Page 1 */}
          <Box mih={'calc(100vh - 64px)'}>
            <Stack ta="center" align="center" gap="lg">
              <Title order={1}>Welcome to SharX</Title>
              <Text fz="lg" mb="lg">
                Make your social activity becomes a gateway to earning cryptocurrency.
              </Text>
              <Button size="lg" onClick={handleClick} loading={loading || Boolean(nextPage)}>
                Join Now
              </Button>
            </Stack>
          </Box>

          {/* Page 2 */}
        </Box>

        <Space h={100} />
      </RwdLayout>
    </>
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
