'use client'

import Image from 'next/image'
import Decimal from 'decimal.js'
import { useRouter } from '@/navigation'
import { useState, useMemo } from 'react'
import { useForm } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { Paper, Stack, Group, Title, Text, Space } from '@mantine/core'
import { Button, TextInput, NumberInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getTokens } from '@/contracts/tokens'
import { formatBalance, formatAmount } from '@/utils/math'
import { classifyError } from '@/wallet/utils/handleError'
import { getNetwork } from '@/wallet/utils/network'
import classes from './index.module.css'

type FormData = {
  symbol: string // token
  to: string
  amount: string
}

export default function Send() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const { chainId, walletAddress, balances, prices, updateBalances, contracts } = useWeb3()

  // Get tokens and network info
  const tokens = useMemo(() => getTokens(chainId), [chainId])
  const network = useMemo(() => getNetwork(chainId), [chainId])

  const form = useForm<FormData>({
    mode: 'controlled',
    initialValues: {
      symbol: tokens[0].symbol || 'USDC',
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

  const { symbol } = form.values

  // Get token info
  const { token, balance, price } = useMemo(() => {
    const token = tokens.find(o => o.symbol === symbol)
    return { token, balance: balances[symbol], price: prices[symbol] }
  }, [symbol, tokens, balances, prices])

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

  const handleSubmit = async (values: FormData) => {
    if (!walletAddress) return

    if (!balance) {
      form.setFieldError('amount', 'Insufficient balance')
      return
    }

    const tokenContract = contracts.tokens[values.symbol]
    if (token && tokenContract) {
      const amount = formatAmount(values.amount, token.decimal)
      // check balance
      if (new Decimal(amount).gt(balance.toString())) {
        form.setFieldError('amount', 'Insufficient balance')
        return
      }

      setLoading(true)

      try {
        const { hash } = await tokenContract.transfer(values.to, amount.toString())
        console.log(`Transaction hash: ${hash}`)
        setLoading(false)
        updateBalances()

        router.push('/wallet')
      } catch (err) {
        console.error(err)
        classifyError(err)
        setLoading(false)
      }
    }
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit(handleSubmit, (validationErrors, values, event) => {
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
                  <Image src="/icons/usdc-token.svg" width={40} height={40} alt="usdc" />
                  <Stack gap={4}>
                    <Text fz="lg" fw={500} lh={1}>
                      USDC
                    </Text>
                    <Text fz="xs" c="dimmed" lh={1}>
                      USD Coin
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              {/* Network */}
              <Paper p="md" shadow="xs" radius="sm">
                <Group>
                  <Image src={network.icon} width={40} height={40} alt={network.name} />
                  <Stack gap={4}>
                    <Text fz="lg" fw={500} lh={1}>
                      {network.name}
                    </Text>
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
