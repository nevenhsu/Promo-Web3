'use client'

import { useState, useEffect } from 'react'
import { modals } from '@mantine/modals'
import { Stepper, Stack, Group, Badge, Space, List } from '@mantine/core'
import { Button, TextInput, Text, Progress } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { useUserToken } from '@/store/contexts/app/userTokenContext'
import { useMint } from './useMint'
import IconButton from './IconButton'
import TokenPaper from './TokenPaper'
import Completion, { Status } from '@/components/share/Completion'
import { cleanSymbol, cleanName } from '@/utils/helper'
import { checkToken } from '@/services/userTokens'
import { TransactionExecutionError } from 'viem'

export default function MintFlow() {
  const { mintState, mint } = useUserToken()
  const { chainId, currentClient } = useWeb3()
  const { callMint } = useMint()

  // state
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState(Status.Init)
  const [error, setError] = useState<string>()

  // avatar
  const [iconImg, setIconImg] = useState('')
  const [iconError, setIconError] = useState<string>()
  const iconURI = iconError ? '' : iconImg
  const errorMsg = error || iconError

  const notConnected = !chainId || !currentClient

  const handleSubmit = async (values: typeof form.values) => {
    const name = values.name.trim()
    const symbol = values.symbol.trim()

    try {
      if (!chainId) {
        return
      }

      const valid = await checkToken({
        name,
        symbol,
        chainId,
      })

      if (valid) {
        setActive(active + 1)
      }
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        const msg = error?.response?.data?.error
        if (msg) {
          // error from check token api
          if (msg.includes('Name is')) {
            form.setFieldError('name', 'Choose another name')
          } else if (msg.includes('Symbol is')) {
            form.setFieldError('symbol', 'Choose another symbol')
          } else {
            setError(msg)
          }
        } else {
          setError(error.message)
        }
      }
    }
  }

  const handleMint = async () => {
    if (notConnected) {
      setStatus(Status.Failed)
      return
    }

    const tryUpload = async () => {
      mint({ chainId, walletAddress: currentClient.account.address, iconURI })
        .then(() => {
          setStatus(Status.Success)
        })
        .catch(error => {
          console.error(error)
          setStatus(Status.Failed)
        })
    }

    setStatus(Status.Pending)
    setActive(active + 1)

    // send transaction
    callMint(
      name,
      symbol,
      async values => {
        tryUpload()
      },
      error => {
        if (error instanceof TransactionExecutionError && error.details === 'execution reverted') {
          setStatus(Status.Failed)
        } else {
          tryUpload()
        }
      }
    )
  }

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      symbol: '',
    },
    validate: {
      name: value =>
        hasLength({ min: 3, max: 12 }, 'Name must be 3-12 characters long')(value.trim()),
      symbol: value =>
        hasLength({ min: 2, max: 8 }, 'Symbol must be 2-8 characters long')(cleanSymbol(value)),
    },
  })

  const { name, symbol } = form.getValues()

  // Clean name
  useEffect(() => {
    if (name) {
      form.setValues({ name: cleanName(name) })
    }
  }, [name])

  // Clean symbol
  useEffect(() => {
    if (symbol) {
      form.setValues({ symbol: cleanSymbol(symbol) })
    }
  }, [symbol])

  // Clear error
  useEffect(() => {
    if (error && chainId && currentClient) {
      setError(undefined)
    } else if (!chainId || !currentClient) {
      setError('No wallet connected')
    }
  }, [error, chainId, currentClient])

  // Sync mint state
  useEffect(() => {
    if (mintState.error) {
      setStatus(Status.Failed)
    }
  }, [mintState])

  return (
    <>
      <Stepper
        size="sm"
        iconSize={32}
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="First step" description="Fill out this form" allowStepSelect={false}>
          <Stack>
            <Stack align="center" gap="xs">
              <IconButton
                url={iconURI}
                onChange={file => {
                  if (file && file.size >= 1024 * 1024 * 10) {
                    setIconError('Image size cannot exceed 10mb')
                  } else {
                    setIconError(undefined)
                  }
                }}
                onDataURLChange={dataURI => {
                  setIconImg(dataURI || '')
                }}
              />

              {errorMsg ? (
                <Badge size="sm" color="red">
                  {errorMsg}
                </Badge>
              ) : null}
            </Stack>

            <form
              onSubmit={form.onSubmit(
                values => handleSubmit(values),
                (validationErrors, values, event) => {
                  console.log(
                    validationErrors, // <- form.errors at the moment of submit
                    values, // <- form.getValues() at the moment of submit
                    event // <- form element submit event
                  )
                }
              )}
            >
              <Stack>
                <TextInput
                  label="Name"
                  description="3-12 characters (English letters or numbers)"
                  key={form.key('name')}
                  {...form.getInputProps('name')}
                />

                <TextInput
                  label="Symbol"
                  description="2-8 characters (English letters or numbers)"
                  key={form.key('symbol')}
                  {...form.getInputProps('symbol')}
                />

                <Space h={24} />

                <Group justify="space-between">
                  <Button color="dark" variant="outline" onClick={() => modals.closeAll()}>
                    Close
                  </Button>
                  <Button type="submit" disabled={name.length < 3 || symbol.length < 2}>
                    Next
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Mint your token" allowStepSelect={false}>
          <Stack>
            <TokenPaper name={name} symbol={symbol} icon={iconURI} />

            <List type="ordered" size="sm" c="dimmed">
              <List.Item>Be sure to double-check the information.</List.Item>
              <List.Item>Once minted, the token cannot be changed.</List.Item>
            </List>

            {errorMsg ? (
              <Badge size="sm" color="red" mx="auto">
                {errorMsg}
              </Badge>
            ) : null}

            <Space h={144} />

            <Group justify="space-between">
              <Button color="dark" variant="outline" onClick={() => modals.closeAll()}>
                Close
              </Button>
              <Group>
                <Button variant="outline" color="dark" onClick={() => setActive(0)}>
                  Back
                </Button>
                <Button onClick={handleMint} disabled={notConnected}>
                  Mint
                </Button>
              </Group>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
          <Stack align="center" justify="center">
            <Completion
              onOk={() => modals.closeAll()}
              status={status}
              text={{
                pending: 'Minting...',
                okay: status === Status.Success ? 'Okay, done' : 'Close',
              }}
              header={
                <>
                  <TokenPaper name={name} symbol={symbol} icon={iconURI} />
                </>
              }
              description={
                <Stack>
                  {status === Status.Pending && <Progress w="100%" value={100} animated />}

                  <Text fz="sm" c="dimmed" mb="xl">
                    {status === Status.Pending
                      ? `Don't close this window. Wait for the transaction to be confirmed, this may take
                    a few minutes.`
                      : status === Status.Success
                        ? 'Your token has been minted successfully!'
                        : status === Status.Failed
                          ? 'Failed to mint your token. Please try again later.'
                          : ''}
                  </Text>

                  <Space h={40} />
                </Stack>
              }
            />
          </Stack>
        </Stepper.Completed>
      </Stepper>
    </>
  )
}
