'use client'

import Decimal from 'decimal.js'
import { Link } from '@/i18n/routing'
import { Title, Stack, Space, Paper, Group, ActionIcon } from '@mantine/core'
import { Text, Button, ThemeIcon, Box, Divider } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { PiCoinVertical, PiCaretRight } from 'react-icons/pi'
import { isTypeA } from '@/types/activitySetting'
import type { TPublicActivity } from '@/models/activity'

export default function ProfileActivity() {
  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Group justify="space-between">
            <Title order={3}>Activity</Title>
            <Link href="/profile/activity/new">
              <Button size="sm">New</Button>
            </Link>
          </Group>

          <Link href="/profile/token">
            <Paper p="md" shadow="xs">
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <ThemeIcon size="xl" radius="md">
                    <PiCoinVertical size={24} />
                  </ThemeIcon>
                  <Box>
                    <Title order={4} fw={500}>
                      Mint token
                    </Title>
                    <Text size="xs" c="dimmed">
                      Create your own token as prize
                    </Text>
                  </Box>
                </Group>
                <ActionIcon color="dark">
                  <PiCaretRight size={24} />
                </ActionIcon>
              </Group>
            </Paper>
          </Link>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function ActivityItem({ data }: { data: TPublicActivity }) {
  const remainingToken = calcRemainingToken(data)

  return (
    <>
      <Link
        href={{
          pathname: '/activity/[slug]',
          params: { slug: data.slug },
        }}
      >
        <Paper px="md" radius="sm" shadow="xs" mih={168} display="flex">
          <Group wrap="nowrap" align="stretch" w="100%">
            {/* Left */}
            <Stack py="md" w={64} flex="1 0 auto" justify="space-between">
              <Box ta="center">
                <Text className="nowrap" fz="sm" lh={1}>
                  {data.airdrop.symbol}
                </Text>
                <Title className="nowrap" order={3} c="orange">
                  {formatNumber(data.airdrop.amount)}
                </Title>
              </Box>
              <Text className="nowrap" ta="center" fz="xs" c="dimmed">
                {formatDate(new Date(data.startTime))}
              </Text>
            </Stack>

            <Divider orientation="vertical" />

            {/* Right */}
            <Stack gap={32} py="md" w="100%" justify="space-between">
              <Title order={4} fw={500} mb={8} mt={-4} lh={1.25}>
                {data.title}
              </Title>

              <Stack gap={4}>
                <Group justify="space-between">
                  <Text fz="xs" c="dimmed">
                    Platform
                  </Text>
                  <Text fz="xs">{data.socialMedia}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fz="xs" c="dimmed">
                    Total score
                  </Text>
                  <Text fz="xs">{data.details.totalScore}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fz="xs" c="dimmed">
                    Remaining token
                  </Text>
                  <Text fz="xs">{formatNumber(remainingToken.toString())}</Text>
                </Group>
              </Stack>

              <Group justify="right">
                <Button size="sm" px="md">
                  Setting
                </Button>
              </Group>
            </Stack>
          </Group>
        </Paper>
      </Link>
    </>
  )
}

function calcRemainingToken(data: TPublicActivity) {
  const { details, airdrop, setting } = data
  const totalScore = details.totalScore || 0
  const amount = airdrop?.amount || '0'

  if (isTypeA(setting)) {
    const { maxTotalScore } = setting.data
    const prizeRatio = new Decimal(amount).div(maxTotalScore)
    const remainingToken = prizeRatio.mul(maxTotalScore - totalScore)
    return remainingToken
  }

  return new Decimal(0)
}
