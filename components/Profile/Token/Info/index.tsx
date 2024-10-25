'use client'

import { useState } from 'react'
import { arbitrum, arbitrumSepolia } from 'viem/chains'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useDisclosure } from '@mantine/hooks'
import { Title, Stack, Space, Paper, Group, Divider } from '@mantine/core'
import { Text, Button, TextInput, Box, Modal } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import RwdLayout from '@/components/share/RwdLayout'
import IconButton from './IconButton'
import { cleanSymbol } from '@/utils/helper'
import { getNetwork, type NetworkInfo } from '@/wallet/utils/network'

const arbitrumNetwork = getNetwork(arbitrum.id)
const arbitrumSepoliaNetwork = getNetwork(arbitrumSepolia.id)

export default function TokenInfo() {
  const [opened, { open, close }] = useDisclosure(false)

  // avatar
  const [icon, setIcon] = useState<string>()
  const [iconError, setIconError] = useState<string>()
  const iconURI = iconError ? '' : icon

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
        hasLength({ min: 3, max: 6 }, 'Symbol must be 3-6 characters long')(cleanSymbol(value)),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const name = values.name.trim()
    const cleaned = cleanSymbol(values.symbol)
    if (name && cleaned) {
      // Update token info
    }
  }

  const alreadyUpdated = false

  const renderNetwork = (network: NetworkInfo) => {
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
          <Button onClick={open}>Mint</Button>
        </Group>
      </Paper>
    )
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Title order={3}>Token setting</Title>

          <Box mx="auto">
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
                setIcon(dataURI || '')
              }}
            />
          </Box>

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
              <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />
              <TextInput
                label="Symbol"
                key={form.key('symbol')}
                {...form.getInputProps('symbol')}
              />

              <Group justify="right" mt="sm">
                <Link href="/profile/token">
                  <Button variant="outline" color="dark">
                    Back
                  </Button>
                </Link>

                <Button type="submit">{alreadyUpdated ? 'Updated' : 'Update'}</Button>
              </Group>
            </Stack>
          </form>

          <Divider my="md" />

          <Title order={4}>Network</Title>

          <Stack>
            {/* Network */}
            {[arbitrumNetwork, arbitrumSepoliaNetwork].map(o => (
              <Box key={o.name}>{renderNetwork(o)}</Box>
            ))}
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
          <Text>Name and symbol cannot be changed after minting</Text>

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
