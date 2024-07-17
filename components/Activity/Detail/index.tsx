'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/navigation'
import { useAsyncFn } from 'react-use'
import useLogin from '@/hooks/useLogin'
import { usePromo } from '@/hooks/usePromo'
import { useAppSelector } from '@/hooks/redux'
import { getPublicActivityDetails } from '@/services/activity'
import { getUserActivityStatus, resetUserActivityStatus } from '@/services/userActivityStatus'
import { Group, Stack, Box, Space, Divider, Paper } from '@mantine/core'
import { Title, Text, Button, ThemeIcon, Progress } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLightning, PiPersonSimpleRun, PiTrophy, PiCheckBold } from 'react-icons/pi'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { getActionLabel } from '../variables'
import type { TPublicActivity } from '@/models/activity'
import type { TUserActivityStatus } from '@/models/userActivityStatus'

type ActivityDetailProps = { data: TPublicActivity; children?: React.ReactNode }

export default function ActivityDetail({ data, children }: ActivityDetailProps) {
  const { slug } = data
  const router = useRouter()
  const promo = usePromo()
  const { _id } = useAppSelector(state => state.user)
  const loggedIn = Boolean(_id)

  const [status, setStatus] = useState<TUserActivityStatus | undefined>()

  const [fetchDetailsState, fetchDetails] = useAsyncFn(async (slug: string) => {
    const details = await getPublicActivityDetails(slug)
    return details
  }, [])

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // If the user was already authenticated, do nothing
      if (wasAlreadyAuthenticated) return

      // If the user is new and has a promo code, redirect to the referral code page
      if (isNewUser && promo) {
        // @ts-ignore
        router.push(`/refer/code?callbackUrl=/activity/${slug}`)
        return
      }
    },
  })

  const { value: details } = fetchDetailsState

  useEffect(() => {
    fetchDetails(slug)
  }, [slug])

  useEffect(() => {
    if (loggedIn && slug) {
      getUserActivityStatus(slug).then(setStatus).catch(console.error)
    }
  }, [loggedIn, slug])

  const handleComplete = async () => {
    try {
      if (loggedIn && slug) {
        const status = await resetUserActivityStatus(slug)
        setStatus(status)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Box>
            <Text c="dimmed" fz="xs">
              {formatDate(new Date(data.startTime))} ~ {formatDate(new Date(data.endTime))}
            </Text>
            <Title order={3}>{data.title}</Title>
          </Box>

          <Text fz="sm" c="dark">
            {data.description}
          </Text>

          <Title order={4} c="orange">
            {formatNumber(data.airdrop.amount)} {data.airdrop.symbol}
          </Title>

          {status ? (
            <>
              <Stack gap="sm">
                <Paper radius="sm" p="md" shadow="xs">
                  <Group>
                    <ThemeIcon color="green" radius="xl" size="lg">
                      <PiCheckBold />
                    </ThemeIcon>
                    <Box>
                      <Title order={5} fw={500}>
                        Successfully joined!
                      </Title>
                      <Text c="dimmed" fz="xs">
                        Keep the post until the event end
                      </Text>
                    </Box>
                  </Group>
                </Paper>

                <Paper radius="sm" p="md" shadow="xs">
                  <Group justify="space-between">
                    <Title order={4} fw={500}>
                      Activity Score
                    </Title>
                    <Title order={4} c="orange">
                      1.2k
                    </Title>
                  </Group>

                  <Stack mt={8} gap="lg">
                    <Divider />

                    <Stack gap="lg">
                      <Box>
                        <Text c="dark" fz="sm" mb="xs">
                          Your post score
                        </Text>

                        <Progress.Root size="sm">
                          <Progress.Section value={10} color="orange" />
                          <Progress.Section value={5} color="orange.2" />
                        </Progress.Root>

                        <Group mt="xs" justify="space-between">
                          <Group gap="sm">
                            <Text fz="sm" c="orange">
                              Score: 1.2k
                            </Text>
                            <Text fz="sm" c="orange.4">
                              Bonus: 600
                            </Text>
                          </Group>
                          <Text fz="sm" c="dimmed">
                            Total: 1.4m
                          </Text>
                        </Group>
                      </Box>
                    </Stack>

                    <Text fz="xs" c="dimmed">
                      Last Updated at 6 Jun 2024 18:32
                    </Text>
                  </Stack>
                </Paper>

                <Paper radius="sm" p="md" shadow="xs">
                  <Group justify="space-between">
                    <Title order={4} fw={500}>
                      Airdrop share
                    </Title>
                    <Title order={4} c="orange">
                      10.2 USDC
                    </Title>
                  </Group>

                  <Stack mt={8} gap="lg">
                    <Divider />

                    <Stack gap="lg">
                      <Box>
                        <Text c="dark" fz="sm" mb="xs">
                          Your share
                        </Text>

                        <Progress size="sm" value={10.2} />

                        <Group mt="xs" gap={4}>
                          <Text fz="sm" c="orange">
                            10.2
                          </Text>
                          <Text fz="sm" c="dimmed">
                            / 100
                          </Text>
                        </Group>
                      </Box>
                    </Stack>

                    <Text fz="xs" c="dimmed">
                      Airdrop share will finalized at 31 Jul 2024
                    </Text>
                  </Stack>
                </Paper>
              </Stack>
            </>
          ) : null}

          <>
            <Divider />
            <Title order={6}>Event Details</Title>
            <Stack gap="xs">
              <Group gap="xs">
                <PiLightning size={20} />
                <Text fz="sm">
                  {getActionLabel(data.activityType)} on {data.socialMedia.toUpperCase()}
                </Text>
              </Group>

              {details ? (
                <>
                  <Group gap="xs">
                    <PiPersonSimpleRun size={20} />
                    <Text fz="sm">{formatNumber(details.participants)} Participants</Text>
                  </Group>

                  <Group gap="xs">
                    <PiTrophy size={20} />
                    <Text fz="sm">{formatNumber(details.totalScore)} Total score</Text>
                  </Group>
                </>
              ) : null}
            </Stack>
            <Divider />
          </>

          <Stack>
            <Button variant="outline">Open link</Button>
            {loggedIn ? (
              <Button onClick={handleComplete}>
                {getActionLabel(data.activityType)} completed
              </Button>
            ) : (
              <Button onClick={login}>Join now</Button>
            )}
          </Stack>

          {/* Embedded Post */}
          {children}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
