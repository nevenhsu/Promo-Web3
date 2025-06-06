'use client'

import * as _ from 'lodash-es'
import { useRouter } from '@/i18n/routing'
import { useState, useMemo, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { useTx } from '@/wallet/TxContext'
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'
import { Paper, Stack, Group, Title, Text, Space, Divider, Box } from '@mantine/core'
import { Button, TextInput, NumberInput, Select } from '@mantine/core'
import { ThemeIcon, Modal, FocusTrap } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { TokenIcon } from '@/components/share/TokenIcon'
import { isErc20, isETH, eth, type Token } from '@/contracts/tokens'
import { formatBalance, formatAmount } from '@/utils/math'
import { TxStatus, TxType } from '@/types/db'
import { PiArrowDown } from 'react-icons/pi'
import { isAddressEqual, isAddress } from '@/wallet/utils/helper'
import { saveTxCallback } from './txCallback'
import type { FeeValuesEIP1559 } from 'viem'
import type { Tx, AddTxReturn, TransactionParameters } from '@/wallet/TxContext'

type FormData = {
  symbol: string // token
  to: string
  amount: string // display value
}

export default function Send() {
  const router = useRouter()

  const [opened, { open, close }] = useDisclosure(false)
  const { txs, addTx } = useTx()
  const {
    onSmartAccount,
    currentClient,
    balancesValues,
    pricesValues,
    tokenListValues,
    publicClient,
  } = useWeb3()
  const { balances, updateBalances } = balancesValues
  const { prices } = pricesValues
  const { allTokens } = tokenListValues
  const walletAddress = currentClient?.account.address

  const [txTimestamp, setTxTimestamp] = useState(0)
  const [feeData, setFeeData] = useState<FeeValuesEIP1559>()

  const tx = useMemo(() => {
    return txTimestamp ? _.find(txs, { timestamp: txTimestamp }) : undefined
  }, [txs, txTimestamp])

  const form = useForm<FormData>({
    mode: 'controlled',
    initialValues: {
      symbol: eth.symbol,
      to: '',
      amount: '',
    },
    validate: {
      symbol: value => (value ? null : 'Should not be empty'),
      to: value =>
        value
          ? !isAddress(value)
            ? 'Invalid address'
            : isAddressEqual(value, walletAddress || '')
              ? 'Should not be the same wallet'
              : null
          : 'Should not be empty',
      amount: value => (Number(value) > 0 ? null : 'Should be greater than 0'),
    },
  })

  useEffect(() => {
    if (tx && tx.status === TxStatus.Success) {
      updateBalances()
    } else if (tx && tx.status === TxStatus.Failed) {
    }
  }, [tx])

  const { symbol, amount } = form.values

  // Get token info
  const { token, balance, price } = useMemo(() => {
    const token = _.find([eth, ...allTokens], { symbol })
    return { token, balance: balances[symbol], price: prices[symbol] }
  }, [allTokens, symbol, balances, prices])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (isAddress(text)) {
        form.setFieldValue('to', text)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleMaxEth = async () => {
    try {
      if (balance && publicClient) {
        const gas =
          currentClient && form.values.to
            ? await publicClient.estimateGas({
                to: form.values.to as any,
                value: BigInt(0),
              })
            : BigInt(21000)

        const feeData = await publicClient.estimateFeesPerGas()
        const totalGasCost = feeData.maxFeePerGas * gas // Total gas cost in wei
        const maxETH = balance.balance - totalGasCost
        if (maxETH > 0) {
          const displayAmount = formatBalance(maxETH, balance.decimals).toString()
          form.setFieldValue('amount', displayAmount)
        } else {
          form.setFieldError('amount', 'Insufficient balance')
        }

        setFeeData(feeData)
      } else {
        form.setFieldValue('amount', '0')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleMax = async () => {
    if (balance) {
      if (symbol !== eth.symbol || onSmartAccount) {
        form.setFieldValue('amount', formatBalance(balance.balance, balance.decimals).toString())
      } else {
        // EOA wallet send ETH
        handleMaxEth()
      }
    } else {
      form.setFieldValue('amount', '0')
    }
  }

  const confirmSubmit = (values: FormData) => {
    if (!currentClient) return

    if (!token) {
      form.setFieldError('amount', 'Invalid token')
      return
    }

    if (!balance) {
      form.setFieldError('amount', 'Invalid balance')
      return
    }

    const rawAmount = formatAmount(values.amount, balance.decimals) // raw value
    if (rawAmount.gt(balance.balance.toString())) {
      form.setFieldError('amount', 'Insufficient balance')
      return
    }

    // Set final display value
    const correctedAmount = formatBalance(rawAmount, balance.decimals).toString()
    form.setFieldValue('amount', correctedAmount)

    modals.openConfirmModal({
      title: 'Confirm Transfer',
      children: (
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fz="sm" c="dimmed">
              Transfer
            </Text>
            <Text fz="sm" fw={500}>
              {correctedAmount} {token.symbol}
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
      onConfirm: () => handleSubmit(values.to, rawAmount.toFixed(0)),
    })
  }

  const handleSubmit = async (to: string, rawAmount: string) => {
    if (!token) return
    if (!currentClient) return

    let result: AddTxReturn

    const displayAmount = formatBalance(rawAmount, token.decimals).toString() // display value
    const description = `Transfer ${displayAmount} ${token.symbol} to ${to}`

    if (isETH(token)) {
      const data = {
        to: to as `0x${string}`,
        value: BigInt(rawAmount),
        native: true,
      }
      const txData: TransactionParameters = feeData
        ? {
            ...data,
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            gas: BigInt(21000),
          }
        : data

      result = addTx(
        currentClient,
        txData,
        {
          description,
        },
        saveTxCallback({ to, symbol: token.symbol, type: TxType.Native, displayAmount })
      )
    }

    if (isErc20(token)) {
      result = addTx(
        currentClient,
        {
          address: token.address,
          functionName: 'transfer',
          args: [to, rawAmount],
          abi: token.abi,
        },
        {
          description,
        },
        saveTxCallback({
          to,
          symbol: token.symbol,
          type: TxType.ERC20,
          displayAmount,
          contract: token.address,
        })
      )
    }

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

            <FocusTrap active>
              <Stack>
                {/* Address */}
                <Stack pos="relative" gap={4}>
                  <Paper p="md" radius="sm" h={96}>
                    <Text fz="sm" fw={500} mb="xs">
                      My wallet
                    </Text>
                    <Text className="nowrap" fz="sm">
                      {walletAddress || 'No wallet address'}
                    </Text>
                  </Paper>

                  <ThemeIcon
                    className="absolute-center"
                    variant="white"
                    mx="auto"
                    size="lg"
                    bd="4px solid var(--my-color-bg)"
                  >
                    <PiArrowDown size={20} />
                  </ThemeIcon>

                  <Paper p="md" radius="sm" h={96}>
                    <Group justify="space-between">
                      <Text fz="sm" fw={500}>
                        Transfer to
                      </Text>
                      <Button size="compact-xs" variant="outline" onClick={handlePaste}>
                        Paste
                      </Button>
                    </Group>

                    <TextInput
                      placeholder="Wallet Address (0x...)"
                      variant="unstyled"
                      key={form.key('to')}
                      styles={{
                        root: { position: 'relative' },
                        input: { border: 'none' },
                        error: {
                          position: 'absolute',
                          bottom: -12,
                        },
                      }}
                      data-autofocus
                      {...form.getInputProps('to')}
                    />
                  </Paper>
                </Stack>

                {/* Token */}
                <Select
                  label="Token"
                  placeholder="Pick a token"
                  data={[eth, ...allTokens].map(o => ({
                    value: o.symbol,
                    label: `${o.symbol} - ${o.name}`,
                  }))}
                  allowDeselect={false}
                  checkIconPosition="right"
                  leftSection={token ? <TokenIcon token={token} size={20} /> : null}
                  {...form.getInputProps('symbol')}
                />

                {/* Amount */}
                <Stack gap={4} pos="relative">
                  <NumberInput
                    label="Amount"
                    placeholder=""
                    rightSectionWidth={48}
                    rightSection={
                      <Button onClick={handleMax} size="compact-sm" variant="transparent">
                        Max
                      </Button>
                    }
                    key={form.key('amount')}
                    {...form.getInputProps('amount')}
                  />

                  <Text
                    fz="xs"
                    c="dimmed"
                    ta="right"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 4,
                    }}
                  >
                    {token
                      ? `Available Balance: ${formatBalance(balance?.balance || 0, balance?.decimals || 0).toDP(6)}`
                      : ''}
                  </Text>

                  <Group justify="right">
                    <Text fz="xs" c="dimmed">
                      {price ? `USD ${price.mul(Number(amount) || '0').toDP(2)}` : 'No price yet'}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </FocusTrap>

            <Group grow>
              <Button type="submit" disabled={Boolean(txTimestamp)}>
                Confirm Transfer
              </Button>
            </Group>
          </Stack>
        </RwdLayout>
      </form>

      <Modal opened={opened} onClose={() => {}} withCloseButton={false} centered>
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
  token?: Token
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
          {token ? <TokenIcon token={token} size={80} /> : null}

          <Title order={4} lh={1}>
            {symbol || '-'}
          </Title>
          <Text fz="xs" c="dimmed" lh={1}>
            {token?.name || '-'}
          </Text>
        </Stack>

        <Divider />

        {tx && (
          <>
            <Stack gap="sm" align="center">
              <Title order={3}>
                {tx.status === TxStatus.Success
                  ? 'Success!'
                  : tx.status === TxStatus.Failed
                    ? 'Failed!'
                    : tx.status === TxStatus.Confirming
                      ? 'Confirming...'
                      : 'Pending...'}
              </Title>
              <Box ta="center">
                <Text className="nowrap" fz="sm" c="dimmed" mb="xs">
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
