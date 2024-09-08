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

          <Marquee
            style={{
              position: 'absolute',
              bottom: 0,
              background: 'var(--mantine-color-black)',
            }}
            autoFill
          >
            <Text c="white" px="md" py="xs">
              🎉 Share 2 Earn – Turn Your Reposts into Cryptocurrency!
            </Text>
          </Marquee>
        </Box>
        {/* Content */}
        <Box pos="relative">
          {/* Page 1 */}
          <Box mih={'calc(100vh - 64px)'}>
            <Stack ta="center" align="center" gap="lg">
              <Title order={1}>Welcome to SharX</Title>
              <Text fz="lg" mb="lg">
                Make your social activity becomes a gateway to earning cryptocurrency.
              </Text>
              <Button size="md" onClick={handleClick} loading={loading || Boolean(nextPage)}>
                Join Now
              </Button>
            </Stack>
          </Box>

          <Space h={40} />

          <Box mx="auto" w={{ base: '100%', sm: 600 }}>
            {/* Page 2 */}
            <Stack gap="xl">
              <Title order={3}>Get Started in 3 Easy Steps</Title>
              <Timeline active={4} lineWidth={2}>
                <Timeline.Item title="Connect your account">
                  <Text c="dimmed" size="sm">
                    Link your social account to join us.
                  </Text>
                </Timeline.Item>

                <Timeline.Item title="Share the post">
                  <Text c="dimmed" size="sm">
                    Repost the content on your feed.
                  </Text>
                </Timeline.Item>

                <Timeline.Item title="Earn rewards">
                  <Text c="dimmed" size="sm">
                    Receive cryptocurrency airdrops for every qualifying share.
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Stack>
          </Box>
        </Box>

        <Space h={40} />
      </RwdLayout>

      <Box pt={40} pb={60} px="md" bg="black" c="white">
        <Box mx="auto" w={{ base: '100%', sm: 600 }}>
          <Title order={3} mb="md">
            It’s a win-win!
          </Title>
          <Text>Boost your wallet while helping our community grow stronger with each share.</Text>
        </Box>
      </Box>
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
