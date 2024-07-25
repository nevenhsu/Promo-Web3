'use client'

import * as _ from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useRouter } from '@/navigation'
import { useAsyncFn } from 'react-use'
import { usePrivy } from '@privy-io/react-auth'
import useLogin from '@/hooks/useLogin'
import { usePromo } from '@/hooks/usePromo'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { fetchUserActivityStatus, resetUserActivityStatus } from '@/store/slices/userActivityStatus'
import { getPublicActivityDetails } from '@/services/activity'
import { notifications } from '@mantine/notifications'
import { Group, Stack, Box, Space, Divider, Paper, Skeleton } from '@mantine/core'
import { Title, Text, Button, ThemeIcon, Progress } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLightning, PiPersonSimpleRun, PiTrophy, PiCheckBold } from 'react-icons/pi'
import { PiWarningBold, PiCircleDashedBold, PiRocketLaunch } from 'react-icons/pi'
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

  const dispatch = useAppDispatch()
  const router = useRouter()
  const promo = usePromo() // for referral code
  const { bothAuth, loading } = useLoginStatus()

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
  const { userActivityStatus } = useAppSelector(state => state)
  const statusData = userActivityStatus.data[slug]
  const statusDataLoading = userActivityStatus.loading[slug]
  const statusDataFetched = userActivityStatus.fetched[slug]
  const statusLoading = statusDataLoading || !statusDataFetched // not fetched yet
  const bonusScore = _.sum([statusData?.referral1stScore, statusData?.referral2ndScore])

  // Activity details
  const [fetchDetailsState, fetchDetails] = useAsyncFn(async (slug: string) => {
    const details = await getPublicActivityDetails(slug)
    return details
  }, [])

  const details = fetchDetailsState.value || data.details

  const airdropShare = useMemo(() => {
    if (!details || !statusData?.totalScore) return 0
    if (!details.totalScore) return 0
    return (statusData.totalScore / details.totalScore) * Number(airdrop.amount) || 0
  }, [statusData, details, airdrop])

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
    if (statusData?.status === ActivityStatus.Completed) {
      notifications.show({
        title: 'Activity completed',
        message: 'You have already completed this activity',
        color: 'green',
      })
      return
    }

    if (bothAuth && slug && statusData?.status !== ActivityStatus.Initial) {
      dispatch(resetUserActivityStatus(slug))
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
    if (bothAuth && slug) {
      // Fetch new status on page load
      dispatch(fetchUserActivityStatus(slug))
    }
  }, [bothAuth, slug])

  const renderStatus = (userStatus?: TUserActivityStatus) => {
    const { title, message, icon, color } = getStatusContent(userStatus)
    return (
      <>
        <Skeleton visible={statusLoading}>
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
        </Skeleton>
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

          {bothAuth ? (
            <>
              <Stack gap="sm">
                {renderStatus(statusData)}

                {statusData ? (
                  <>
                    <Skeleton visible={statusLoading}>
                      <Paper radius="sm" p="md" shadow="xs">
                        <Group justify="space-between">
                          <Title order={4} fw={500}>
                            Activity Score
                          </Title>
                          <Title order={4} c="orange">
                            {formatNumber(statusData.totalScore)}
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
                                  value={(statusData.selfScore / details.totalScore) * 100}
                                  color="orange"
                                />
                                <Progress.Section
                                  value={(bonusScore / details.totalScore) * 100}
                                  color="orange.2"
                                />
                              </Progress.Root>

                              <Group mt="xs" justify="space-between">
                                <Group gap="sm">
                                  <Text fz="sm" c="orange">
                                    Score: {formatNumber(statusData.selfScore)}
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
                            {statusData.updatedAt
                              ? `Last Updated at ${formatDate(new Date(statusData.updatedAt), 'dd MMM yyyy HH:mm')}`
                              : ' '}
                          </Text>
                        </Stack>
                      </Paper>
                    </Skeleton>

                    <Skeleton visible={statusLoading}>
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

                              <Progress
                                size="sm"
                                value={(airdropShare / Number(airdrop.amount)) * 100}
                              />

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
                    </Skeleton>
                  </>
                ) : null}
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
            {bothAuth ? (
              <>
                <Button variant="outline" onClick={handleLinkAccount} loading={linking}>
                  {linkedX ? `Linked as ${linkedX.username}` : `Link your ${socialMedia}`}
                </Button>

                <Button onClick={handleConfirm} disabled={!linkedX} loading={statusDataLoading}>
                  Confirm {getActionLabel(data.activityType)}
                </Button>
              </>
            ) : (
              <Button onClick={login} loading={loading}>
                Join now
              </Button>
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

function getStatusContent(userStatus?: TUserActivityStatus) {
  const { status, error } = userStatus || {}

  switch (status) {
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
    case ActivityStatus.Initial: {
      const title = 'Waiting for confirmation'
      const message = 'We will confirm your activity soon'
      const icon = <PiCircleDashedBold size={20} />
      const color = 'dark'
      return { title, message, icon, color }
    }
    case ActivityStatus.Unjoined:
    default: {
      const title = 'Join now'
      const message = 'Join this activity to earn rewards'
      const icon = <PiRocketLaunch size={20} />
      const color = 'dark'
      return { title, message, icon, color }
    }
  }
}
