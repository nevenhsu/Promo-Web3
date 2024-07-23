'use client'

import * as _ from 'lodash-es'
import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/navigation'
import { useAsyncFn } from 'react-use'
import { usePrivy } from '@privy-io/react-auth'
import useLogin from '@/hooks/useLogin'
import { usePromo } from '@/hooks/usePromo'
import { useAppSelector } from '@/hooks/redux'
import { getPublicActivityDetails } from '@/services/activity'
import { notifications } from '@mantine/notifications'
import { getUserActivityStatus, resetUserActivityStatus } from '@/services/userActivityStatus'
import { Group, Stack, Box, Space, Divider, Paper } from '@mantine/core'
import { Title, Text, Button, ThemeIcon, Progress } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLightning, PiPersonSimpleRun, PiTrophy, PiCheckBold } from 'react-icons/pi'
import { PiWarningBold, PiTriangleDashedBold, PiCircleDashedBold } from 'react-icons/pi'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { getActionLabel, getErrorText } from '../variables'
import { LinkAccountPlatform, ActivityStatus } from '@/types/db'
import type { TPublicActivity } from '@/models/activity'
import type { TUserActivityStatus } from '@/models/userActivityStatus'

type ActivityDetailProps = { data: TPublicActivity; children?: React.ReactNode }

export default function ActivityDetail({ data, children }: ActivityDetailProps) {
  const { slug, airdrop } = data
  const socialMedia = data.socialMedia.toUpperCase()

  const router = useRouter()
  const promo = usePromo() // for referral code
  const session = useSession()
  const loggedIn = session.status === 'authenticated'

  // Platform linked account from Privy
  const { user, linkTwitter } = usePrivy()
  const { twitter } = user || {}

  // Platform linked account from database
  const { data: userData, linking } = useAppSelector(state => state.user)
  const { linkedAccounts } = userData
  const linkedX = useMemo(() => {
    if (!linkedAccounts) return
    return linkedAccounts.find(({ platform }) => platform === LinkAccountPlatform.X)
  }, [linkedAccounts])

  // for use activity status
  const [status, setStatus] = useState<TUserActivityStatus | undefined>()
  const bonusScore = _.sum([status?.referral1stScore, status?.referral2ndScore])

  // Activity details
  const [fetchDetailsState, fetchDetails] = useAsyncFn(async (slug: string) => {
    const details = await getPublicActivityDetails(slug)
    return details
  }, [])

  // Reset user activity status
  const [resetUserStatusState, resetUserStatus] = useAsyncFn(async (slug: string) => {
    const status = await resetUserActivityStatus(slug)
    return status
  }, [])

  const details = fetchDetailsState.value || data.details

  const airdropShare = useMemo(() => {
    if (!details || !status) return 0
    if (!details.totalScore) return 0

    return (status.totalScore / details.totalScore) * Number(airdrop.amount) || 0
  }, [status, details, airdrop])

  // Login to join activity
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

  const handleConfirm = () => {
    // If the activity is completed or initial, do nothing
    if (status?.status === ActivityStatus.Completed) {
      notifications.show({
        title: 'Activity completed',
        message: 'You have already completed this activity',
        color: 'green',
      })
      return
    }

    if (loggedIn && slug && status?.status !== ActivityStatus.Initial) {
      resetUserStatus(slug)
    }

    notifications.show({
      title: 'Waiting for confirmation',
      message: 'We will confirm your activity soon',
      color: 'blue',
    })
  }

  const handleLinkAccount = () => {
    if (twitter) return
    linkTwitter()
  }

  // Fetch realtime activity details
  useEffect(() => {
    fetchDetails(slug)
  }, [slug])

  // Fetch user activity status
  useEffect(() => {
    if (loggedIn && slug) {
      getUserActivityStatus(slug).then(setStatus).catch(console.error)
    }
  }, [loggedIn, slug])

  // Update user activity status
  useEffect(() => {
    if (resetUserStatusState.value) {
      setStatus(resetUserStatusState.value)
    }
  }, [resetUserStatusState.value])

  const renderStatus = (userStatus: TUserActivityStatus) => {
    const { title, message, icon, color } = getStatusContent(userStatus)

    return (
      <>
        <Paper radius="sm" p="md" shadow="xs">
          <Group wrap="nowrap">
            <ThemeIcon color={color} radius="xl" size="lg">
              {icon}
            </ThemeIcon>
            <Box>
              <Title order={5} fw={500}>
                {title}
              </Title>
              <Text c="dimmed" fz="xs">
                {message}
              </Text>
            </Box>
          </Group>
        </Paper>
      </>
    )
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

          {details && status ? (
            <>
              <Stack gap="sm">
                {renderStatus(status)}

                <Paper radius="sm" p="md" shadow="xs">
                  <Group justify="space-between">
                    <Title order={4} fw={500}>
                      Activity Score
                    </Title>
                    <Title order={4} c="orange">
                      {formatNumber(status.totalScore)}
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
                          <Progress.Section
                            value={status.selfScore / details.totalScore}
                            color="orange"
                          />
                          <Progress.Section
                            value={bonusScore / details.totalScore}
                            color="orange.2"
                          />
                        </Progress.Root>

                        <Group mt="xs" justify="space-between">
                          <Group gap="sm">
                            <Text fz="sm" c="orange">
                              Score: {formatNumber(status.selfScore)}
                            </Text>
                            <Text fz="sm" c="orange.4">
                              Bonus: {formatNumber(bonusScore)}
                            </Text>
                          </Group>
                          <Text fz="sm" c="dimmed">
                            Total: {formatNumber(details.totalScore)}
                          </Text>
                        </Group>
                      </Box>
                    </Stack>

                    <Text fz="xs" c="dimmed">
                      Last Updated at {formatDate(new Date(status.updatedAt), 'dd MMM yyyy HH:mm')}
                    </Text>
                  </Stack>
                </Paper>

                <Paper radius="sm" p="md" shadow="xs">
                  <Group justify="space-between">
                    <Title order={4} fw={500}>
                      Airdrop share
                    </Title>
                    <Title order={4} c="orange">
                      {formatNumber(airdropShare)} {airdrop.symbol}
                    </Title>
                  </Group>

                  <Stack mt={8} gap="lg">
                    <Divider />

                    <Stack gap="lg">
                      <Box>
                        <Text c="dark" fz="sm" mb="xs">
                          Your share
                        </Text>

                        <Progress size="sm" value={airdropShare / Number(airdrop.amount)} />

                        <Group mt="xs" gap={4}>
                          <Text fz="sm" c="orange">
                            {formatNumber(airdropShare)}
                          </Text>
                          <Text fz="sm" c="dimmed">
                            / {formatNumber(airdrop.amount)}
                          </Text>
                        </Group>
                      </Box>
                    </Stack>

                    <Text fz="xs" c="dimmed">
                      Airdrop will finalized after{' '}
                      {formatDate(new Date(data.endTime), 'dd MMM yyyy HH:mm')}
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
                  {getActionLabel(data.activityType)} on {socialMedia}
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
            {loggedIn ? (
              <>
                <Button variant="outline" onClick={handleLinkAccount} loading={linking}>
                  {linkedX ? `Linked as ${linkedX.username}` : `Link your ${socialMedia}`}
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={!linkedX}
                  loading={resetUserStatusState.loading}
                >
                  Confirm {getActionLabel(data.activityType)}
                </Button>
              </>
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

function getStatusContent(userStatus: TUserActivityStatus) {
  const { status, error } = userStatus

  switch (status) {
    case ActivityStatus.Unjoined: {
      const title = 'Join now'
      const message = 'You have not joined this activity yet'
      const icon = <PiTriangleDashedBold size={20} />
      const color = 'dark'
      return { title, message, icon, color }
    }
    case ActivityStatus.Completed: {
      const title = 'Successfully joined!'
      const message = 'Keep your activity until the event end'
      const icon = <PiCheckBold size={20} />
      const color = 'green'
      return { title, message, icon, color }
    }
    case ActivityStatus.Error: {
      const { title, message } = getErrorText(error || 0)
      const icon = <PiWarningBold size={20} />
      const color = 'red'
      return { title, message, icon, color }
    }
    case ActivityStatus.Initial:
    default: {
      const title = 'Waiting for confirmation'
      const message = 'We will confirm your activity soon'
      const icon = <PiCircleDashedBold size={20} />
      const color = 'blue'
      return { title, message, icon, color }
    }
  }
}
