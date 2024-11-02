'use client'

import * as _ from 'lodash-es'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useDisclosure } from '@mantine/hooks'
import { Title, Stack, Space, Paper, Group, Divider } from '@mantine/core'
import { Text, Button, TextInput, Box, Modal, Badge, Progress } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import RwdLayout from '@/components/share/RwdLayout'
import IconButton from './IconButton'
import { tokenManagers } from '@/contracts'
import { useUserToken } from '@/store/contexts/app/userToken'
import { useWeb3 } from '@/wallet/Web3Context'
import { cleanSymbol } from '@/utils/helper'
import { getNetwork, type NetworkInfo } from '@/wallet/utils/network'

export default function TokenInfo() {
  const networkRef = useRef(0)

  const { smartAccountValues } = useWeb3()
  const { smartAccountAddress } = smartAccountValues

  const { data, error, loading, updateToken, mint } = useUserToken()
  const { userToken, tokens = [] } = data || {}
  const icon = userToken?.icon || ''
  const minted = Boolean(tokens.length)
  const valid = Boolean(userToken && userToken.name && userToken.symbol)

  const [opened, { open, close }] = useDisclosure(false)

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

  const handleSubmit = (values: typeof form.values) => {
    const name = values.name.trim()
    const symbol = cleanSymbol(values.symbol)
    if (name && symbol && smartAccountAddress) {
      updateToken({ name, symbol, icon, iconURI, walletAddr: smartAccountAddress })
    }
  }

  const handleMint = async () => {
    const chainId = networkRef.current
    if (chainId) {
      await mint(chainId)
      close()
    }
  }

  const { name, symbol } = form.getValues()
  const alreadyUpdated =
    userToken?.name === name && userToken?.symbol === symbol && icon === iconImg

  const errorMsg = alreadyUpdated ? '' : iconError

  const renderNetwork = (network: NetworkInfo) => {
    const token = _.find(tokens, { chainId: network.chainId })
    const { minted } = token || {}
    const updated = Boolean(token)
    const loading = updated && !minted
    return (
      <Paper
        p="md"
        shadow="xs"
        radius="sm"
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <Image src={network.icon} width={40} height={40} alt={network.name} />
            <Stack gap={4}>
              <Text fz="lg" fw={500} lh={1}>
                {network.name}
              </Text>
              <Text fz="xs" c="dimmed" lh={1}>
                {loading ? 'It takes a couple of hours to be minted' : `${network.subtitle}`}
              </Text>
            </Stack>
          </Group>
          {loading ? null : (
            <Button
              size="sm"
              onClick={() => {
                networkRef.current = network.chainId || 0
                open()
              }}
              disabled={!valid || updated}
            >
              {updated ? 'Minted' : 'Mint'}
            </Button>
          )}
        </Group>

        {loading ? (
          <Progress
            value={100}
            size="sm"
            animated
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              left: 0,
            }}
          />
        ) : null}
      </Paper>
    )
  }

  // Set initial values if userToken exists
  useEffect(() => {
    if (userToken) {
      form.setValues({
        name: userToken.name,
        symbol: userToken.symbol,
      })
      setIconImg(userToken.icon || '')
    }
  }, [userToken])

  // Clean symbol
  useEffect(() => {
    if (symbol) {
      form.setValues({ symbol: cleanSymbol(symbol) })
    }
  }, [symbol])

  // Set form error
  useEffect(() => {
    const msg = error?.response?.data?.error
    if (msg && msg.includes('Name is')) {
      form.setFieldError('name', 'Choose another name')
    }

    if (msg && msg.includes('Symbol is')) {
      form.setFieldError('symbol', 'Choose another symbol')
    }
  }, [error])

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Title order={3}>Token info</Title>

          <Stack align="center" gap="xs">
            <IconButton
              url={icon}
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
                key={form.key('name')}
                {...form.getInputProps('name')}
                disabled={minted}
              />

              <TextInput
                label="Symbol"
                key={form.key('symbol')}
                {...form.getInputProps('symbol')}
                disabled={minted}
              />

              <Group justify="right" mt="sm">
                <Link href="/profile/token">
                  <Button variant="outline" color="dark">
                    Back
                  </Button>
                </Link>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={!smartAccountAddress || alreadyUpdated}
                >
                  {alreadyUpdated ? 'Updated' : 'Update'}
                </Button>
              </Group>
            </Stack>
          </form>

          <Divider my="md" />

          <Group justify="space-between">
            <Title order={4}>Network</Title>

            {valid ? null : (
              <Badge size="sm" color="red">
                Update info to mint token
              </Badge>
            )}
          </Group>

          <Stack>
            {/* Network */}
            {_.map(tokenManagers, o => {
              const network = getNetwork(o.chainId)
              return <Box key={o.chainId}>{renderNetwork(network)}</Box>
            })}
          </Stack>
        </Stack>
      </RwdLayout>

      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          <Text fz="lg" fw={500}>
            Confirm to mint token
          </Text>
        }
      >
        <Stack>
          <Text fz="sm">Name and symbol cannot be changed after minting</Text>

          <Group justify="right" mt="md">
            <Button variant="outline" color="dark" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleMint}>Confirm</Button>
          </Group>
        </Stack>
      </Modal>

      <Space h={100} />
    </>
  )
}
