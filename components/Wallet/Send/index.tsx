'use client'

import * as _ from 'lodash-es'
import Image from 'next/image'
import Decimal from 'decimal.js'
import { useRouter } from '@/navigation'
import { useState, useMemo, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { useTx, type Tx } from '@/wallet/TxContext'
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'
import { Paper, Stack, Group, Title, Text, Space, Divider, Box } from '@mantine/core'
import { Button, TextInput, NumberInput, Modal } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getTokens, getToken } from '@/contracts/tokens'
import { formatBalance, formatAmount } from '@/utils/math'
import { getNetwork } from '@/wallet/utils/network'
import { createTransaction } from '@/services/transaction'
import { TxStatus } from '@/types/db'
import { type Erc20 } from '@/contracts/tokens'

type FormData = {
  symbol: string // token
  to: string
  amount: string
}

export default function Send() {
  const router = useRouter()

  const [opened, { open, close }] = useDisclosure(false)
  const [txTimestamp, setTxTimestamp] = useState(0)
  const { chainId, walletAddress, balancesValues, pricesValues } = useWeb3()
  const { balances, updateBalances } = balancesValues
  const { prices } = pricesValues
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
    } else if (tx && tx.status === TxStatus.Failed) {
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

    const amount = formatAmount(values.amount, token.decimal) // raw value
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

    const val = formatBalance(amount, token.decimal).toString() // display value
    const result = addTx(
      {
        contractAddr: token.address,
        fnName: 'transfer',
        fnArgs: [to, amount],
        description: `Transfer ${val} ${token.symbol} to ${to}`,
      },
      async ({ hash, waitSuccess, timestamp }) => {
        if (chainId && walletAddress) {
          try {
            const success = await waitSuccess
            // save to db
            const tx = await createTransaction({
              chainId,
              hash,
              from: walletAddress,
              to,
              contract: token.address,
              token: {
                symbol: token.symbol,
                amount: val,
              },
              status: success ? TxStatus.Success : TxStatus.Failed,
              createdAt: new Date(timestamp),
            })
            console.log('Transaction saved: ', tx.hash)
          } catch (err) {
            console.error(err)
          }
        }
      }
    )

    if (result) {
      const { timestamp } = result
      setTxTimestamp(timestamp)
      open()
    }
  }

  const handleOnOk = () => {
    router.push('/wallet')
  }

  const handleOnBack = () => {
    close()
    setTxTimestamp(0)
    form.reset()
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
              {/* TODO: Token menu */}
              <Paper p="md" shadow="xs" radius="sm">
                <Group>
                  <Image src={token?.icon || ''} width={32} height={32} alt={token?.symbol || ''} />
                  <Stack gap={4}>
                    <Title order={4} fw={500} lh={1}>
                      {token?.symbol || ''}
                    </Title>
                    <Text fz="xs" c="dimmed" lh={1}>
                      {token?.name || ''}
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
                placeholder="Wallet Address (0x...)"
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
                    {price ? `USD ${price.mul(form.values.amount || '0').toDP(2)}` : 'No price yet'}
                  </Text>
                </Group>
              </Stack>
            </Stack>

            <Group grow>
              <Button type="submit" disabled={Boolean(txTimestamp)}>
                Confirm Transfer
              </Button>
            </Group>
          </Stack>
        </RwdLayout>
      </form>

      <Modal opened={opened} onClose={() => {}} withCloseButton={false} size="xl" centered>
        <Transaction
          tx={tx}
          token={token}
          values={form.values}
          onOk={handleOnOk}
          onBack={handleOnBack}
        />
      </Modal>

      <Space h={100} />
    </>
  )
}

function Transaction({
  tx,
  token,
  values,
  onOk,
  onBack,
}: {
  tx?: Tx
  token?: Erc20
  values: FormData
  onOk: () => void
  onBack: () => void
}) {
  const { to, amount, symbol } = values

  const loading =
    tx?.status === TxStatus.Init ||
    tx?.status === TxStatus.Pending ||
    tx?.status === TxStatus.Confirming
  const isFinished = tx?.status === TxStatus.Success || tx?.status === TxStatus.Failed

  return (
    <>
      <Stack gap="lg" py="md">
        <Stack gap="sm" align="center">
          <Image src={token?.icon || ''} width={80} height={80} alt={symbol} />
          <Title order={4} lh={1}>
            {symbol || 'No Token'}
          </Title>
          <Text fz="xs" c="dimmed" lh={1}>
            {token?.name || 'Error'}
          </Text>
        </Stack>

        <Divider />

        {tx && (
          <>
            <Stack gap="sm" align="center">
              <Title order={3}>
                {tx.status === TxStatus.Success
                  ? 'Successful!'
                  : tx.status === TxStatus.Failed
                    ? 'Failed!'
                    : tx.status === TxStatus.Confirming
                      ? 'Confirming'
                      : 'Sending'}
              </Title>
              <Box ta="center">
                <Text fz="sm" c="dimmed" mb="xs">
                  {tx.status === TxStatus.Failed
                    ? tx.error
                    : `${amount} ${symbol} ${
                        tx.status === TxStatus.Success ? 'has been sent' : 'is being sent'
                      } to the address:`}
                </Text>
                <Text fz="xs" c="dimmed">
                  {tx.status === TxStatus.Failed ? '' : to}
                </Text>
              </Box>
            </Stack>
          </>
        )}

        <Stack>
          <Button onClick={onOk} loading={loading}>
            Okay, done
          </Button>
          {isFinished && (
            <Button variant="outline" onClick={onBack}>
              Back to send
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  )
}
