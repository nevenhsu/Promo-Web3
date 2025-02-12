'use client'

import Decimal from 'decimal.js'
import { isAfter } from 'date-fns'
import { Link } from '@/i18n/routing'
import { Group, Stack, Paper, Box } from '@mantine/core'
import { Title, Text, Button, Divider } from '@mantine/core'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { isTypeA } from '@/types/activitySetting'
import type { TActivity } from '@/models/activity'

export function ActivityCard({ data }: { data: TActivity }) {
  const isEnd = isAfter(new Date(), new Date(data.endTime))
  const remainingToken = calcRemainingToken(data)

  return (
    <>
      <Link href={{ pathname: '/activity/[slug]', params: { slug: data.slug } }}>
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
              <Stack>
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
              </Stack>

              <Group justify="space-between" wrap="nowrap">
                <Box />

                <Button variant={isEnd ? 'outline' : 'filled'} size="sm" px="md">
                  {isEnd ? 'End' : 'Update'}
                </Button>
              </Group>
            </Stack>
          </Group>
        </Paper>
      </Link>
    </>
  )
}

function calcRemainingToken(data: TActivity) {
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
