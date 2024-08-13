'use client'

import * as _ from 'lodash-es'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useRouter } from '@/navigation'
import { useAsyncFn } from 'react-use'
import { usePrivy } from '@privy-io/react-auth'
import useLogin from '@/hooks/useLogin'
import { usePromo } from '@/hooks/usePromo'
import { useAppContext } from '@/store/AppContext'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { fetchUserActivityStatus, resetUserActivityStatus } from '@/store/slices/userActivityStatus'
import { getPublicActivityDetails } from '@/services/activity'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { Group, Stack, Box, Space, Divider, Paper } from '@mantine/core'
import { Title, Text, Button, ThemeIcon, ActionIcon } from '@mantine/core'
import { Skeleton, Progress, Center } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import LinkModal from '@/components/share/LinkModal'
import LinkButton from '@/components/share/LinkButton'
import { ReferralLinkModal } from '../modals/ReferralLinkModal'
import { HowToJoinModal } from '../modals/HowToJoinModal'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { getActionLabel, getErrorText } from '../variables'
import { ActivityStatus } from '@/types/db'
import { toUpper } from '@/utils/helper'
import { allTokens } from '@/contracts/tokens'
import { PiLightning, PiPersonSimpleRun, PiTrophy, PiCheckBold } from 'react-icons/pi'
import { PiWarningBold, PiCircleDashedBold, PiRocketLaunch, PiShareFatFill } from 'react-icons/pi'
import type { TPublicActivity } from '@/models/activity'
import type { TUserActivityStatus } from '@/models/userActivityStatus'

type ActivityDetailProps = { data: TPublicActivity; children?: React.ReactNode }

export default function ActivityDetail({ data, children }: ActivityDetailProps) {
  const { slug, airdrop, socialMedia } = data
  const token = _.find(allTokens, { symbol: airdrop.symbol })

  const dispatch = useAppDispatch()
  const router = useRouter()
  const promo = usePromo() // for referral code
  const { bothAuth, loading } = useLoginStatus()

  // for link modal
  const { isMobileDevice } = useAppContext().state
  const [opened, { open, close }] = useDisclosure(false)

  // for modal
  const [shareOpened, shareActions] = useDisclosure(false)
  const [joinOpened, joinActions] = useDisclosure(false)

  // Platform linked account from Privy
  const { user, linkTwitter } = usePrivy()
  const { twitter } = user || {}

  // User data
  const { data: userData, referralData } = useAppSelector(state => state.user)
  const { code } = referralData || {}

  // Platform linked account from database
  const { linkedAccounts } = userData
  const { linked, linkedAccount } = useMemo(() => {
    const linkedAccount = linkedAccounts?.find(({ platform }) => platform === socialMedia)
    const linked = Boolean(linkedAccount)
    return { linked, linkedAccount }
  }, [linkedAccounts, socialMedia])

  // for use activity status
  const { userActivityStatus } = useAppSelector(state => state)
  const statusData = userActivityStatus.data[slug]
  const statusDataLoading = userActivityStatus.loading[slug]
  const statusDataFetched = userActivityStatus.fetched[slug]
  const statusLoading = statusDataLoading || !statusDataFetched // not fetched yet
  const bonusScore = _.sum([statusData?.referral1stScore, statusData?.referral2ndScore])
  const confirmed = statusData?.status === ActivityStatus.Completed

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
    if (confirmed) {
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

    isMobileDevice ? open() : linkTwitter()
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
          <Group wrap="nowrap" justify="space-between">
            <Box>
              <Text c="dimmed" fz="xs">
                {formatDate(new Date(data.startTime))} ~ {formatDate(new Date(data.endTime))}
              </Text>
              <Title order={3}>{data.title}</Title>
            </Box>
            {code ? (
              <ActionIcon
                variant="outline"
                size="md"
                radius="md"
                bg="white"
                loading={!code}
                onClick={shareActions.open}
              >
                <PiShareFatFill />
              </ActionIcon>
            ) : null}
          </Group>

          <Text fz="sm" c="dark">
            {data.description}
          </Text>

          <Group gap="xs">
            {token ? <Image src={token.icon} width={20} height={20} alt={token.symbol} /> : null}
            <Title order={4} c="orange">
              {formatNumber(data.airdrop.amount)} {data.airdrop.symbol}
            </Title>
          </Group>

          {bothAuth ? (
            <>
              <Stack gap="sm">
                {renderStatus(statusData)}

                {statusData && statusData.totalScore > 0 ? (
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
                                Your activity score
                              </Text>

                              <Progress.Root size="sm">
                                <Progress.Section
                                  value={(statusData.selfScore / details.totalScore) * 100}
                                  color="orange"
                                />
                                <Progress.Section
                                  value={(bonusScore / details.totalScore) * 100}
                                  color="orange.3"
                                />
                              </Progress.Root>

                              <Group mt="xs" justify="space-between">
                                <Group gap="sm" c="orange">
                                  <Text fz="sm">Score: {formatNumber(statusData.selfScore)}</Text>
                                  <Text fz="sm">Bonus: {formatNumber(bonusScore)}</Text>
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
                            Airdrop reward
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
                                Current estimated reward
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
                  {getActionLabel(data.activityType)} on {toUpper(socialMedia)}
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
                <LinkButton platform={socialMedia} onLink={handleLinkAccount} />

                <Button
                  onClick={handleConfirm}
                  disabled={!linked || confirmed}
                  loading={statusDataLoading}
                >
                  {confirmed ? 'Completed' : `Confirm ${getActionLabel(data.activityType)}`}
                </Button>
              </>
            ) : (
              <Button onClick={login} loading={loading}>
                Join now
              </Button>
            )}

            <Center>
              <Button color="dark" size="sm" variant="transparent" onClick={joinActions.open}>
                How to join?
              </Button>
            </Center>
          </Stack>

          {/* Embedded Post */}
          {children}
        </Stack>
      </RwdLayout>

      <LinkModal platform={socialMedia} opened={opened} onClose={close} />

      {/* Referral link */}
      <ReferralLinkModal slug={slug} opened={shareOpened} onClose={shareActions.close} />

      {/* How to join */}
      <HowToJoinModal
        opened={joinOpened}
        onClose={joinActions.close}
        activeStep={getActiveStep(linked, statusData?.status)}
      />

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

function getActiveStep(linked: boolean, status?: ActivityStatus) {
  if (!linked) return -1

  switch (status) {
    case ActivityStatus.Error:
      return 2
    case ActivityStatus.Initial:
      return 3
    case ActivityStatus.Completed:
      return 4
    default:
      return 1
  }
}
