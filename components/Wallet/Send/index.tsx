'use client'

import Decimal from 'decimal.js'
import { useRouter } from '@/navigation'
import { useState, useMemo, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { Paper, Stack, Group, Title, Text, Divider, Space } from '@mantine/core'
import { Button, Checkbox, TextInput, NumberInput, Select } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCaretDown } from 'react-icons/pi'
import { getTokens } from '@/contracts/tokens'
import { formatBalance, formatAmount } from '@/utils/math'
import { classifyError } from '@/wallet/utils/handleError'
import classes from './index.module.css'

type FormData = {
  symbol: string // token
  to: string
  amount: string
  networkFee: 'Slow' | 'Average' | 'Fast'
}

export default function Send() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const { chainId, walletAddress, balances, prices, updateBalances, contracts } = useWeb3()
  const tokens = useMemo(() => getTokens(chainId), [chainId])

  const form = useForm<FormData>({
    mode: 'controlled',
    initialValues: {
      symbol: '',
      to: '',
      amount: '',
      networkFee: 'Average',
    },
    validate: {
      symbol: value => (value ? null : 'Should not be empty'),
      to: value => (value ? null : 'Should not be empty'),
      amount: value => (value ? null : 'Should not be empty'),
      networkFee: value => (value ? null : 'Should not be empty'),
    },
  })

  const { symbol } = form.values
  const { token, balance, price } = useMemo(() => {
    const token = tokens.find(o => o.symbol === symbol)
    return { token, balance: balances[symbol], price: prices[symbol] }
  }, [symbol, balances, prices])

  useEffect(() => {
    if (tokens.length > 0) {
      form.setFieldValue('symbol', tokens[0].symbol)
    }
  }, [tokens])

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

    const tokenContract = contracts.tokens[values.symbol]
    if (token && tokenContract) {
      const amount = formatAmount(values.amount, token.decimal).toString()

      setLoading(true)

      try {
        const { hash } = await tokenContract.transfer(values.to, amount)
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
          <Stack>
            <Paper p="md" withBorder>
              <Stack gap="lg">
                <Title order={5}>Send Tokens</Title>
                <Select
                  data={tokens.map(o => o.symbol)}
                  withCheckIcon={false}
                  key={form.key('symbol')}
                  {...form.getInputProps('symbol')}
                ></Select>
              </Stack>
            </Paper>

            <Paper p="md" withBorder>
              <Stack gap="lg">
                <Group justify="space-between">
                  <Text fz="sm" fw={500}>
                    To
                  </Text>
                  <Button variant="outline" size="compact-xs" radius="xl">
                    Address book
                  </Button>
                </Group>
                <TextInput
                  placeholder="Public Address (0x)"
                  rightSectionWidth={56}
                  rightSection={
                    <Button size="compact-xs" variant="transparent" onClick={handlePaste}>
                      Paste
                    </Button>
                  }
                  key={form.key('to')}
                  {...form.getInputProps('to')}
                />
                <Checkbox label="Save to address book" variant="outline" size="xs" />
              </Stack>
            </Paper>

            <Paper p="md" withBorder>
              <Stack>
                <NumberInput
                  label="Amount"
                  description={
                    token && balance
                      ? `Available Balance: ${formatBalance(balance, token.decimal).toDP(6)}`
                      : ''
                  }
                  placeholder=""
                  rightSectionWidth={48}
                  rightSection={
                    <Button onClick={handleMax} size="compact-xs" variant="transparent">
                      Max
                    </Button>
                  }
                  key={form.key('amount')}
                  {...form.getInputProps('amount')}
                />

                <Stack gap="xs">
                  <Text fz="sm" fw={500}>
                    Network fee
                  </Text>

                  <Group className={classes.field} justify="space-between">
                    <Text fz="sm">Average</Text>
                    <PiCaretDown size={16} />
                  </Group>
                </Stack>

                <Divider my="xs" />

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fz="sm">Total Amount</Text>
                    <Text fz="sm" fw={500}>
                      {`${form.values.amount} ${symbol}`}
                    </Text>
                  </Group>
                  <Text ta="right" fz="xs" c="dimmed">
                    {price
                      ? `USD ${new Decimal(price).mul(form.values.amount || '0').toDP(2)}`
                      : 'No price yet'}
                  </Text>
                </Stack>
              </Stack>
            </Paper>

            <Space h={0} />

            <Group grow>
              <Button type="submit" loading={loading}>
                Send
              </Button>
            </Group>
          </Stack>

          <Space h={100} />
        </RwdLayout>
      </form>
    </>
  )
}
