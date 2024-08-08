'use client'

import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import Image from 'next/image'
import { Link } from '@/navigation'
import { Tabs, Paper, Stack, Group, Space, Pagination } from '@mantine/core'
import { Center, Text, ThemeIcon, Skeleton } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiArrowCircleUp, PiArrowCircleDown } from 'react-icons/pi'
import { getTransactions } from '@/services/transaction'
import { getToken } from '@/contracts/tokens'
import { formatLocalDate, isEnumMember } from '@/utils/helper'
import type { TTransaction } from '@/models/transaction'

enum TabValue {
  Transaction = 'transaction',
  Airdrop = 'airdrop',
}

type TxPage = {
  total: number
  current: number
  limit: number
}

type Pages = { [key in TabValue]: TxPage }

export default function History() {
  const [activeTab, setActiveTab] = useState(TabValue.Transaction)

  const [pages, setPages] = useState<Pages>({
    transaction: { total: 1, current: 1, limit: 10 },
    airdrop: { total: 1, current: 1, limit: 10 },
  })
  const { total, current, limit } = pages[activeTab]

  const handlePageChange = (page: number) => {
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: page },
    }))
  }

  const [transactions, fetchTransactions] = useAsyncFn(async () => {
    const isAirdrop = activeTab === TabValue.Airdrop
    const data = await getTransactions({ page: current, limit, isAirdrop })
    return data
  }, [current, limit, activeTab])
  // Get data from the hook
  const { value, loading } = transactions
  const txs = value?.txs || []

  // Update total page when transactions are fetched
  useEffect(() => {
    if (value && value.total) {
      const totalPage = Math.ceil(value.total / limit)
      setPages(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], total: totalPage },
      }))
    }
  }, [value, activeTab])

  // Fetch transactions when page changes
  useEffect(() => {
    fetchTransactions()
  }, [current, activeTab])

  // Reset current page when tab changes
  useEffect(() => {
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: 1 },
    }))
  }, [activeTab])

  const renderTransaction = (txs: TTransaction[]) => {
    if (loading) {
      return <Skeleton radius="md" h={64} />
    }

    if (!txs.length) {
      return (
        <Center h={64}>
          <Text c="dimmed">No {activeTab} found</Text>
        </Center>
      )
    }

    return txs.map(tx => {
      const { chainId, isSender, isAirdrop } = tx
      const token = getToken(chainId, tx.token?.symbol)

      return (
        <Link
          key={tx._id}
          href={{
            pathname: '/wallet/history/[tx]',
            params: { tx: tx._id },
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
                  {tx.token?.amount || 'No data'}
                </Text>
                <Text fz="xs" c="dimmed" lh={1}>
                  {formatLocalDate(tx.createdAt, 'MMM dd yyyy h:mm:ss aa')}
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Link>
      )
    })
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
            <Stack py={40}>{renderTransaction(txs)}</Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Airdrop}>
            <Stack py={40}>{renderTransaction(txs)}</Stack>
          </Tabs.Panel>
        </Tabs>

        <Space h="md" />

        <Center>
          <Pagination total={total} value={current} onChange={handlePageChange} />
        </Center>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
