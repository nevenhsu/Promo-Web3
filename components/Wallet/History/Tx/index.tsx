'use client'

import { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import Image from 'next/image'
import { Paper, Stack, Group, Space, Box, Divider, Skeleton } from '@mantine/core'
import { Title, Text, CopyButton, ActionIcon, Pill, Center } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getUserTransaction } from '@/services/transaction'
import { getToken } from '@/contracts/tokens'
import { formateLocalDate } from '@/utils/helper'
import { getNetwork } from '@/wallet/utils/network'
import { formatAddress } from '@/wallet/utils/helper'
import { PiCopy, PiLink } from 'react-icons/pi'
import { TxStatus } from '@/types/db'

export default function HistoryTx({ tx }: { tx: string }) {
  const [TxState, fetchTx] = useAsyncFn(() => getUserTransaction(tx), [tx])

  const { value, loading, error } = TxState

  const network = getNetwork(value?.chainId)
  const token = getToken(value?.chainId, value?.token?.symbol)
  const label = getStatusLabel(value?.status)

  const handleLink = () => {
    if (value?.hash && network.blockExplorerUrl) {
      window.open(`${network.blockExplorerUrl}/tx/${value.hash}`, '_blank')
    }
  }

  useEffect(() => {
    fetchTx()
  }, [])

  return (
    <>
      <RwdLayout>
        <Title order={3}>History</Title>

        <Space h={40} />

        {error ? (
          <Paper radius="md" p="md" shadow="xs">
            <Center>
              <Text c="red">{error.response?.data.error || 'Unknown error'}</Text>
            </Center>
          </Paper>
        ) : (
          <Skeleton visible={loading}>
            <Paper radius="md" p="md" shadow="xs">
              <Stack>
                <Group justify="space-between">
                  <Text fz="sm" c="dark.4">
                    Status
                  </Text>
                  <Text fz="sm" fw={500} c={label.color}>
                    {label.text}
                  </Text>
                </Group>

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    Network
                  </Text>
                  <Text fz="sm">{network.name}</Text>
                </Group>

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    Tx Hash
                  </Text>
                  <Box w={200}>
                    <TxLink val={value?.hash || ''} onClick={handleLink} />
                  </Box>
                </Group>

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    From
                  </Text>
                  <Box w={200}>
                    <WalletText
                      val={value?.from || ''}
                      username={value?._fromWallet?._user.username}
                    />
                  </Box>
                </Group>

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    To
                  </Text>
                  <Box w={200}>
                    <WalletText val={value?.to || ''} username={value?._toWallet?._user.username} />
                  </Box>
                </Group>

                <Divider />

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    Token
                  </Text>
                  <Group gap="xs">
                    {token?.icon ? (
                      <Image src={token.icon} width={18} height={18} alt={token.name} />
                    ) : null}
                    <Text fz="sm">{token?.symbol || 'Unknown'}</Text>
                  </Group>
                </Group>

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    Amount
                  </Text>
                  <Text fz="sm">{value?.token?.amount || 'No data'}</Text>
                </Group>

                <Group justify="space-between" align="start">
                  <Text fz="sm" c="dark.4">
                    Date
                  </Text>
                  <Text fz="sm">
                    {formateLocalDate(value?.createdAt || 0, 'MMM dd yyyy h:mm aa')}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          </Skeleton>
        )}
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function WalletText({ val, username }: { val: string; username?: string }) {
  return (
    <>
      <CopyButton value={val}>
        {({ copied, copy }) => (
          <Group wrap="nowrap" align="start" gap="xs" justify="space-between">
            <Box>
              {username ? <Pill size="sm" mb={2}>{`@${username}`}</Pill> : null}
              <Text fz="xs" c={copied ? 'green' : 'black'} style={{ wordBreak: 'break-word' }}>
                {username ? formatAddress(val) : val}
              </Text>
            </Box>
            <ActionIcon onClick={copy} color={copied ? 'green' : 'black'}>
              <PiCopy size={16} />
            </ActionIcon>
          </Group>
        )}
      </CopyButton>
    </>
  )
}

function TxLink({ val, onClick }: { val: string; onClick?: () => void }) {
  return (
    <>
      <Group wrap="nowrap" align="start" gap="xs">
        <Text fz="xs" style={{ wordBreak: 'break-word' }}>
          {val}
        </Text>
        <ActionIcon color="black" onClick={onClick}>
          <PiLink size={16} />
        </ActionIcon>
      </Group>
    </>
  )
}

function getStatusLabel(status?: number) {
  switch (status) {
    case TxStatus.Pending:
      return {
        color: 'blue',
        text: 'Pending',
      }
    case TxStatus.Success:
      return {
        color: 'green',
        text: 'Success',
      }
    case TxStatus.Confirming:
      return {
        color: 'blue',
        text: 'Confirming',
      }
    case TxStatus.Error:
      return {
        color: 'red',
        text: 'Error',
      }
    case TxStatus.Failed:
      return {
        color: 'red',
        text: 'Failed',
      }
    default:
      return {
        color: 'gray',
        text: 'Unknown',
      }
  }
}
