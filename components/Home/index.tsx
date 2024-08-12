'use client'

import * as _ from 'lodash-es'
import Decimal from 'decimal.js'
import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { useReferral } from '@/store/contexts/app/referralContext'
import { useWeb3 } from '@/wallet/Web3Context'
import { Link } from '@/navigation'
import { Stack, Group, Box, Paper, SimpleGrid, Divider, Space } from '@mantine/core'
import { Title, Text, ThemeIcon, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { formatNumber } from '@/utils/math'
import { PiRocket, PiRocketLaunch, PiCurrencyCircleDollar } from 'react-icons/pi'
import { PiCaretRight, PiBarcode } from 'react-icons/pi'
import type { Airdrop } from '@/services/userStatus'

export default function Home() {
  const { data, statusData } = useAppSelector(state => state.user)
  const { name } = data

  const { isReferred } = useReferral()
  const {
    pricesValues: { prices },
  } = useWeb3()

  const { airdrops = [], progress, status } = statusData || {}
  const { referral1stScore, referral2ndScore, totalScore = 0, selfScore = 0 } = status || {}

  const referralScore = _.sum([referral1stScore, referral2ndScore]) || 0

  // calculate with price
  const { receivedValue, pendingValue, unsettledValue } = useMemo(() => {
    const airdropValues = airdrops.map(o => getAirdropValue(o, prices[o.symbol]))
    const receivedValue = _.sumBy(airdropValues, 'received')
    const pendingValue = _.sumBy(airdropValues, 'pending')
    const unsettledValue = _.sumBy(airdropValues, 'unsettled')
    return { receivedValue, pendingValue, unsettledValue }
  }, [airdrops, prices])

  return (
    <>
      <RwdLayout>
        <Title order={3}>{name ? `Hi, ${name}` : 'Hello!'}</Title>
        <Space h={40} />
        <Stack>
          {/* Total Score */}
          <Paper p={16} c="white" bg="orange">
            <Group justify="space-between">
              <Title order={4}>Total Score</Title>
              <Title order={4}>{totalScore}</Title>
            </Group>
            <Space h={12} />
            <Divider color="white" />
            <Space h={24} />
            <SimpleGrid cols={2}>
              <Group gap={12}>
                <PiRocket size={24} />
                <Box>
                  <Text size="xs">Activity</Text>
                  <Text fw={500}>{selfScore}</Text>
                </Box>
              </Group>
              <Group gap={12}>
                <PiRocketLaunch size={24} />
                <Box>
                  <Text size="xs">Referral</Text>
                  <Text fw={500}>{referralScore}</Text>
                </Box>
              </Group>
            </SimpleGrid>
          </Paper>

          {/* Activity */}
          <Paper p={16} shadow="xs">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocket size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Activity
                </Title>
                <Text size="xs" c="dimmed">
                  Join activities to gain score
                </Text>
              </Box>
            </Group>
            <Space h={16} />
            <Divider />
            <Space h={24} />
            <SimpleGrid cols={2}>
              <Box>
                <Text size="xs" c="dimmed">
                  Participated
                </Text>
                <Title order={4}>{progress?.total || 0}</Title>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">
                  Ongoing
                </Text>
                <Title order={4}>{progress?.ongoing || 0}</Title>
              </Box>
            </SimpleGrid>
          </Paper>

          {/* Airdrop */}
          <Paper p={16} shadow="xs">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiCurrencyCircleDollar size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Airdrop
                </Title>
                <Text size="xs" c="dimmed">
                  Earn airdrop by boosting score
                </Text>
              </Box>
            </Group>
            <Space h={16} />
            <Divider />
            <Space h={24} />
            <SimpleGrid cols={3}>
              <Box>
                <Text size="xs" c="dimmed">
                  Received
                </Text>
                <Title order={4}>${formatNumber(receivedValue)}</Title>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">
                  Pending
                </Text>
                <Title order={4}>${formatNumber(pendingValue)}</Title>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">
                  Unsettled
                </Text>
                <Title order={4}>${formatNumber(unsettledValue)}</Title>
              </Box>
            </SimpleGrid>
          </Paper>

          {/* Refer */}
          <Link href="/refer">
            <Paper p="md" shadow="xs">
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <ThemeIcon size="xl" radius="md">
                    <PiRocketLaunch size={24} />
                  </ThemeIcon>
                  <Box>
                    <Title order={4} fw={500}>
                      Refer a friend
                    </Title>
                    <Text size="xs" c="dimmed">
                      You’ll earn bonus score from friends
                    </Text>
                  </Box>
                </Group>
                <ActionIcon color="dark">
                  <PiCaretRight size={24} />
                </ActionIcon>
              </Group>
            </Paper>
          </Link>

          {/* Referral code */}
          {isReferred ? null : (
            <Link href="/refer/code">
              <Paper p="md" shadow="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap">
                    <ThemeIcon size="xl" radius="md">
                      <PiBarcode size={24} />
                    </ThemeIcon>
                    <Box>
                      <Title order={4} fw={500}>
                        Enter referral code
                      </Title>
                      <Text size="xs" c="dimmed">
                        The code provided by your friend
                      </Text>
                    </Box>
                  </Group>
                  <ActionIcon color="dark">
                    <PiCaretRight size={24} />
                  </ActionIcon>
                </Group>
              </Paper>
            </Link>
          )}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function getAirdropValue(data: Airdrop, _price?: Decimal) {
  const { receivedAmount, pendingAmount, unsettledAmount } = data
  const price = _price || new Decimal(0)
  const received = new Decimal(receivedAmount || 0).mul(price).toNumber()
  const pending = new Decimal(pendingAmount || 0).mul(price).toNumber()
  const unsettled = new Decimal(unsettledAmount || 0).mul(price).toNumber()
  return { received, pending, unsettled }
}
