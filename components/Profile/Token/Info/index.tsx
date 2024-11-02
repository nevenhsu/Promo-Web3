'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useDisclosure } from '@mantine/hooks'
import { Title, Stack, Space, Paper, Group, Divider } from '@mantine/core'
import { Text, Button, TextInput, Box, Modal } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import RwdLayout from '@/components/share/RwdLayout'
import IconButton from './IconButton'
import { activityManagers } from '@/contracts'
import { useUserToken } from '@/store/contexts/app/userToken'
import { useWeb3 } from '@/wallet/Web3Context'
import { cleanSymbol } from '@/utils/helper'
import { getNetwork, type NetworkInfo } from '@/wallet/utils/network'

export default function TokenInfo() {
  const { smartAccountValues } = useWeb3()
  const { smartAccountAddress } = smartAccountValues

  const { data, loading, updateToken } = useUserToken()
  const { userToken, tokens = [] } = data || {}
  const icon = userToken?.icon || ''
  const minted = Boolean(tokens.length)

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

  const { name, symbol } = form.getValues()
  const alreadyUpdated =
    userToken?.name === name && userToken?.symbol === symbol && icon === iconImg

  const renderNetwork = (network: NetworkInfo) => {
    const minted = Boolean(_.find(tokens, { chainId: network.chainId }))
    return (
      <Paper p="md" shadow="xs" radius="sm">
        <Group justify="space-between">
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
          <Button onClick={open} disabled={minted}>
            {minted ? 'Minted' : 'Mint'}
          </Button>
        </Group>
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

            <Text fz="xs" ta="center" c="red">
              {iconError || ''}
            </Text>
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

          <Title order={4}>Network</Title>

          <Stack>
            {/* Network */}
            {_.map(activityManagers, o => {
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
            <Button>Confirm</Button>
          </Group>
        </Stack>
      </Modal>

      <Space h={100} />
    </>
  )
}
