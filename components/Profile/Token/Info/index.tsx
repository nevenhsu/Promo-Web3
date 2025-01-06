'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { Title, Stack, Group } from '@mantine/core'
import { Button, TextInput, Badge } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import IconButton from './IconButton'
import { tokenManagers } from '@/contracts'
import { useUserToken } from '@/store/contexts/app/userToken'
import { useWeb3 } from '@/wallet/Web3Context'
import { checkToken } from '@/services/userTokens'
import { cleanSymbol, cleanName } from '@/utils/helper'
import type { TUserToken } from '@/models/userToken'

type TokenInfoProps = {
  token?: TUserToken
  onClose: () => void
}

export default function TokenInfo(props: TokenInfoProps) {
  const { token, onClose } = props

  const { smartAccountValues, chainId } = useWeb3()
  const { smartAccountAddress } = smartAccountValues

  const { fetchState, updateState, updateTokenDoc, mintState, mint } = useUserToken()
  const minted = !!token

  // avatar
  const [iconImg, setIconImg] = useState('')
  const [iconError, setIconError] = useState<string>()
  const iconURI = iconError ? '' : iconImg

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

  const handleMint = async () => {
    try {
      if (!chainId) {
        return
      }

      const valid = await checkToken({
        name: form.values.name,
        symbol: form.values.symbol,
        chainId,
      })

      // TODO: send transaction

      if (valid && smartAccountAddress) {
        await mint({ chainId, walletAddress: smartAccountAddress, iconURI })
      }
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

  const handleSubmit = async (values: typeof form.values) => {
    const docId = token?._id || ''
    if (minted && docId && iconURI) {
      await updateTokenDoc({ docId, icon: iconImg, iconURI })
    } else {
      await handleMint()
    }
  }

  const { name, symbol } = form.getValues()
  const alreadyUpdated = token?.icon === iconImg && token?.name === name && token?.symbol === symbol
  const loading = updateState.loading || mintState.loading || fetchState.loading
  const errorMsg = alreadyUpdated ? '' : iconError

  // Set initial values if userToken exists
  useEffect(() => {
    if (token) {
      form.setValues({
        name: token.name,
        symbol: token.symbol,
      })
      setIconImg(token.icon || '')
    }
  }, [token])

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
      <Stack gap="lg">
        <Title order={3}>Token info</Title>

        <Stack align="center" gap="xs">
          <IconButton
            url={token?.icon || ''}
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
              description={
                minted ? 'Name cannot be changed' : '3-12 characters (English letters or numbers)'
              }
              key={form.key('name')}
              {...form.getInputProps('name')}
              disabled={minted}
            />

            <TextInput
              label="Symbol"
              description={minted ? 'Symbol cannot be changed' : '2-8 characters (English letters)'}
              key={form.key('symbol')}
              {...form.getInputProps('symbol')}
              disabled={minted}
            />

            <Group justify="right" mt="sm">
              <Button variant="outline" color="dark" onClick={onClose}>
                Back
              </Button>

              <Button
                type="submit"
                loading={loading}
                disabled={!smartAccountAddress || alreadyUpdated}
              >
                {minted ? (alreadyUpdated ? 'Updated' : 'Update') : 'Mint'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </>
  )
}
