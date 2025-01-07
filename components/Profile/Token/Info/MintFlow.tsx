'use client'

import { useState, useEffect } from 'react'
import { Stepper, Stack, Group, Badge } from '@mantine/core'
import { Button, TextInput } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import { useWeb3 } from '@/wallet/Web3Context'
import { useUserToken } from '@/store/contexts/app/userToken'
import IconButton from './IconButton'
import { cleanSymbol, cleanName } from '@/utils/helper'
import { checkToken } from '@/services/userTokens'

export default function MintFlow() {
  const { mintState, mint } = useUserToken()

  const { smartAccountValues, chainId } = useWeb3()
  const { smartAccountAddress } = smartAccountValues

  // state
  const [active, setActive] = useState(0)

  // avatar
  const [iconImg, setIconImg] = useState('')
  const [iconError, setIconError] = useState<string>()
  const iconURI = iconError ? '' : iconImg

  const handleSubmit = async (values: typeof form.values) => {
    if (!chainId || !smartAccountAddress) {
      return
    }

    const valid = await checkToken({
      name: form.values.name,
      symbol: form.values.symbol,
      chainId,
    })

    await handleMint(chainId, smartAccountAddress)
  }

  const handleMint = async (chainId: number, walletAddress: string) => {
    try {
      // TODO: send transaction
      await mint({ chainId, walletAddress, iconURI })
    } catch (error) {
      if (error instanceof Error) {
        const msg = error?.response?.data?.error
        if (msg && msg.includes('Name is')) {
          form.setFieldError('name', 'Choose another name')
        }

        if (msg && msg.includes('Symbol is')) {
          form.setFieldError('symbol', 'Choose another symbol')
        }
      }
    }
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

  // Clean symbol
  useEffect(() => {
    if (symbol) {
      form.setValues({ symbol: cleanSymbol(symbol) })
    }
  }, [symbol])

  // Clean name
  useEffect(() => {
    if (name) {
      form.setValues({ name: cleanName(name.trim()) })
    }
  }, [name])

  return (
    <>
      <Stepper
        size="sm"
        iconSize={32}
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="First step" description="Fill out this form">
          <Stack align="center" gap="xs" mb="xl">
            <IconButton
              url=""
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

            {iconError ? (
              <Badge size="sm" color="red">
                {iconError}
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

              <Group justify="right" mt="sm">
                {active > 0 && <Button onClick={() => setActive(active - 1)}>Back</Button>}
                <Button onClick={() => setActive(active + 1)}>Next</Button>
              </Group>
            </Stack>
          </form>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Mint your token"></Stepper.Step>

        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>
    </>
  )
}
