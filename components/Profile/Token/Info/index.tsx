'use client'

import { useState } from 'react'
import { arbitrum, arbitrumSepolia } from 'viem/chains'
import Image from 'next/image'
import { Link } from '@/navigation'
import { Title, Stack, Space, Paper, Group, Divider } from '@mantine/core'
import { Text, Button, TextInput, Box } from '@mantine/core'
import { useForm, hasLength } from '@mantine/form'
import RwdLayout from '@/components/share/RwdLayout'
import IconButton from './IconButton'
import { cleanSymbol } from '@/utils/helper'
import { getNetwork } from '@/wallet/utils/network'

const arbitrumNetwork = getNetwork(arbitrum.id)
const arbitrumSepoliaNetwork = getNetwork(arbitrumSepolia.id)

export default function TokenInfo() {
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

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Box>
            <Title order={3} mb="sm">
              Token info
            </Title>
            <Text fz="sm" c="dimmed">
              You can set the unique name and symbol before minted on the network
            </Text>
          </Box>

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

              <span />

              <Group justify="right">
                <Link href="/profile/token">
                  <Button variant="outline" color="dark">
                    Back
                  </Button>
                </Link>

                <Button type="submit">{alreadyUpdated ? 'Updated' : 'Update'}</Button>
              </Group>
            </Stack>
          </form>

          <Divider />

          <Title order={4}>Network</Title>

          <Stack>
            {/* Network */}
            <Paper p="md" shadow="xs" radius="sm">
              <Group justify="space-between">
                <Group>
                  <Image
                    src={arbitrumNetwork.icon}
                    width={40}
                    height={40}
                    alt={arbitrumNetwork.name}
                  />
                  <Stack gap={4}>
                    <Text fz="lg" fw={500} lh={1}>
                      {arbitrumNetwork.name}
                    </Text>
                    <Text fz="xs" c="dimmed" lh={1}>
                      {arbitrumNetwork.subtitle}
                    </Text>
                  </Stack>
                </Group>

                <Button>Mint</Button>
              </Group>
            </Paper>

            <Paper p="md" shadow="xs" radius="sm">
              <Group justify="space-between">
                <Group>
                  <Image
                    src={arbitrumSepoliaNetwork.icon}
                    width={40}
                    height={40}
                    alt={arbitrumSepoliaNetwork.name}
                  />
                  <Stack gap={4}>
                    <Text fz="lg" fw={500} lh={1}>
                      {arbitrumSepoliaNetwork.name}
                    </Text>
                    <Text fz="xs" c="dimmed" lh={1}>
                      {arbitrumSepoliaNetwork.subtitle}
                    </Text>
                  </Stack>
                </Group>
                <Button>Mint</Button>
              </Group>
            </Paper>
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
