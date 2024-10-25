'use client'

import Image from 'next/image'
import Decimal from 'decimal.js'
import { Link } from '@/i18n/routing'
import { Tabs, Paper, Stack, Group, Space, Pagination } from '@mantine/core'
import { Center, Text, ThemeIcon, Skeleton } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiArrowCircleUp, PiArrowCircleDown } from 'react-icons/pi'
import { useTransaction, TabValue } from '@/store/contexts/app/transactionContext'
import { getToken, eth } from '@/contracts/tokens'
import { formatLocalDate, isEnumMember } from '@/utils/helper'
import { TxType } from '@/types/db'
import type { TTransaction } from '@/models/transaction'

export default function History() {
  const { total, current, activeTab, setActiveTab, handlePageChange, data, loading } =
    useTransaction()

  const renderTransaction = () => {
    if (loading) {
      return <Skeleton radius="md" h={64} />
    }

    if (!data.length) {
      return (
        <Center h={64}>
          <Text c="dimmed">No tx found</Text>
        </Center>
      )
    }

    return data.map(tx => <TxItem key={tx._id} data={tx} />)
  }

  return (
    <>
      <RwdLayout>
        <Tabs
          value={activeTab}
          onChange={o => {
            if (o && isEnumMember(o, TabValue)) {
              setActiveTab(o as TabValue)
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value={TabValue.Transaction}>Transaction</Tabs.Tab>
            <Tabs.Tab value={TabValue.Airdrop}>Airdrop</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.Transaction}>
            <Stack py={40}>{renderTransaction()}</Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Airdrop}>
            <Stack py={40}>{renderTransaction()}</Stack>
          </Tabs.Panel>
        </Tabs>

        <Space h="md" />

        <Center>
          <Pagination
            total={total}
            value={current}
            onChange={handlePageChange}
            disabled={loading}
          />
        </Center>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function TxItem({ data }: { data: TTransaction }) {
  const { chainId, isSender, isAirdrop, type } = data
  const isNative = type === TxType.Native
  const token = isNative ? eth : getToken(chainId, data.token?.symbol)

  return (
    <Link
      href={{
        pathname: '/wallet/history/[tx]',
        params: { tx: data._id },
      }}
    >
      <Paper p="md" shadow="xs" radius="md" h={64}>
        <Group justify="space-between">
          <Group>
            {isAirdrop ? (
              <Image src={token?.icon || ''} width={32} height={32} alt={token?.name || ''} />
            ) : (
              <ThemeIcon size={32} variant="white" color={isSender ? 'red' : 'blue'}>
                {isSender ? <PiArrowCircleUp size={32} /> : <PiArrowCircleDown size={32} />}
              </ThemeIcon>
            )}

            <Stack gap={4}>
              <Text fw={500} lh={1}>
                {token?.symbol || 'Unknown'}
              </Text>
              <Text fz="xs" c="dimmed" lh={1}>
                {token?.name || 'Unknown Token'}
              </Text>
            </Stack>
          </Group>

          <Stack gap={4} ta="right">
            <Text fw={500} lh={1}>
              {isSender ? '-' : '+'}
              {data.token?.amount ? new Decimal(data.token.amount).toFixed(6) : 'No data'}
            </Text>
            <Text fz="xs" c="dimmed" lh={1}>
              {formatLocalDate(data.createdAt, 'MMM dd yyyy h:mm:ss aa')}
            </Text>
          </Stack>
        </Group>
      </Paper>
    </Link>
  )
}
