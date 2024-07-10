'use client'

import * as _ from 'lodash-es'
import Image from 'next/image'
import Decimal from 'decimal.js'
import { useRouter } from '@/navigation'
import { useState, useMemo, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { useTx, TxStatus } from '@/wallet/TxContext'
import { modals } from '@mantine/modals'
import { Paper, Stack, Group, Title, Text, Space } from '@mantine/core'
import { Button, TextInput, NumberInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getTokens, getToken } from '@/contracts/tokens'
import { formatBalance, formatAmount } from '@/utils/math'
import { getNetwork } from '@/wallet/utils/network'

type FormData = {
  symbol: string // token
  to: string
  amount: string
}

export default function Send() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [txTimestamp, setTxTimestamp] = useState(0)
  const { chainId, walletAddress, balances, prices, updateBalances, getContract } = useWeb3()
  const { txs, addTx } = useTx()

  const tx = useMemo(() => {
    return txTimestamp ? _.find(txs, { timestamp: txTimestamp }) : undefined
  }, [txs, txTimestamp])

  // Get tokens and network info
  const tokens = useMemo(() => getTokens(chainId), [chainId])
  const network = useMemo(() => getNetwork(chainId), [chainId])

  const form = useForm<FormData>({
    mode: 'controlled',
    initialValues: {
      symbol: 'USDC',
      to: '',
      amount: '',
    },
    validate: {
      symbol: value => (value ? null : 'Should not be empty'),
      to: value =>
        value
          ? value !== walletAddress
            ? null
            : 'Should not be the same wallet'
          : 'Should not be empty',
      amount: value => (value ? null : 'Should not be empty'),
    },
  })

  useEffect(() => {
    if (tokens.length) {
      form.setFieldValue('symbol', tokens[0].symbol)
    }
  }, [tokens])

  useEffect(() => {
    if (tx && tx.status === TxStatus.Success) {
      updateBalances()
      setLoading(false)
    } else if (tx && tx.status === TxStatus.Failed) {
      setLoading(false)
    }
  }, [tx])

  const { symbol } = form.values

  // Get token info
  const { token, balance, price } = useMemo(() => {
    const token = getToken(chainId, symbol)
    return { token, balance: balances[symbol], price: prices[symbol] }
  }, [chainId, symbol, balances, prices])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.startsWith('0x')) {
        form.setFieldValue('to', text)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleMax = () => {
    if (token && balance) {
      form.setFieldValue('amount', formatBalance(balance, token.decimal).toString())
    }
  }

  const confirmSubmit = (values: FormData) => {
    if (!walletAddress) return

    if (!token) {
      form.setFieldError('amount', 'Invalid token')
      return
    }

    if (!balance) {
      form.setFieldError('amount', 'Insufficient balance')
      return
    }

    const amount = formatAmount(values.amount, token.decimal)
    if (new Decimal(amount).gt(balance.toString())) {
      form.setFieldError('amount', 'Insufficient balance')
      return
    }

    modals.openConfirmModal({
      title: 'Confirm Transfer',
      children: (
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fz="sm" c="dimmed">
              Transfer
            </Text>
            <Text fz="sm" fw={500}>
              {values.amount} {token.symbol}
            </Text>
          </Group>
          <Group justify="space-between" align="start">
            <Text fz="sm" c="dimmed">
              To
            </Text>
            <Text
              fz="sm"
              w={200}
              fw={500}
              ta="right"
              style={{
                wordBreak: 'break-all',
              }}
            >
              {values.to}
            </Text>
          </Group>
        </Stack>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => handleSubmit(values.to, amount.toString()),
    })
  }

  const handleSubmit = async (to: string, amount: string) => {
    if (!token) return
    setLoading(true)

    const val = formatBalance(amount, token.decimal).toString()
    const result = addTx(token.address, 'transfer', [to, amount], `Transfer ${val} USDC`)

    if (result) {
      setTxTimestamp(result.timestamp)
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit(confirmSubmit, (validationErrors, values, event) => {
          console.log(
            validationErrors, // <- form.errors at the moment of submit
            values, // <- form.getValues() at the moment of submit
            event // <- form element submit event
          )
        })}
      >
        <RwdLayout>
          <Stack gap="xl">
            <Title order={3}>Send</Title>

            <Stack>
              {/* Token */}
              <Paper p="md" shadow="xs" radius="sm">
                <Group>
                  <Image src="/icons/usdc-token.svg" width={32} height={32} alt="usdc" />
                  <Stack gap={4}>
                    <Title order={4} fw={500} lh={1}>
                      USDC
                    </Title>
                    <Text fz="xs" c="dimmed" lh={1}>
                      USD Coin
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              {/* Network */}
              <Paper p="md" shadow="xs" radius="sm">
                <Group>
                  <Image src={network.icon} width={32} height={32} alt={network.name} />
                  <Stack gap={4}>
                    <Title order={4} fw={500} lh={1}>
                      {network.name}
                    </Title>
                    <Text fz="xs" c="dimmed" lh={1}>
                      {network.subtitle}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Stack>

            <Stack>
              <TextInput
                label="Transfer Address"
                placeholder="Public Address (0x...)"
                rightSectionWidth={56}
                rightSection={
                  <Button size="compact-sm" variant="transparent" onClick={handlePaste}>
                    Paste
                  </Button>
                }
                size="md"
                key={form.key('to')}
                {...form.getInputProps('to')}
              />

              <Stack gap={4}>
                <NumberInput
                  label="Amount"
                  placeholder=""
                  rightSectionWidth={48}
                  rightSection={
                    <Button onClick={handleMax} size="compact-sm" variant="transparent">
                      Max
                    </Button>
                  }
                  size="md"
                  key={form.key('amount')}
                  {...form.getInputProps('amount')}
                />

                <Group justify="space-between">
                  <Text fz="xs" c="dimmed">
                    {token
                      ? `Available Balance: ${formatBalance(balance || 0, token.decimal).toDP(6)}`
                      : ''}
                  </Text>

                  <Text fz="xs" c="dimmed">
                    {price
                      ? `USD ${new Decimal(price).mul(form.values.amount || '0').toDP(2)}`
                      : 'No price yet'}
                  </Text>
                </Group>
              </Stack>
            </Stack>

            <Group grow>
              <Button type="submit" loading={loading}>
                Confirm Transfer
              </Button>
            </Group>
          </Stack>
        </RwdLayout>
      </form>

      <Space h={100} />
    </>
  )
}
