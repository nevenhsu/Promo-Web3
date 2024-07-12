'use client'

import { useState } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { useDisclosure } from '@mantine/hooks'
import { Space, Stack, Modal, Avatar, Group, Box } from '@mantine/core'
import { Text, Title, Button, TextInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getPublicUser } from '@/services/user'
import { PiBarcode } from 'react-icons/pi'
import type { PublicUser } from '@/types/db'

export default function ReferCode() {
  const { data, _id } = useAppSelector(state => state.user)

  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const [user, setUser] = useState<PublicUser>()
  const [loading, setLoading] = useState(false)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const user = await getPublicUser(value)
      if (user) {
        setUser(user)
        open()
      } else {
        setError('User not found. Please try another code.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (value === data.username) {
      setError('You cannot refer yourself.')
      return
    }

    if (value === user?.username) {
      open()
      return
    }

    if (value) {
      fetchUser()
    }
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Referral Code</Title>

          <TextInput
            leftSection={<PiBarcode size={24} />}
            placeholder="Enter referral code"
            value={value}
            error={error}
            onChange={event => {
              setValue(event.currentTarget.value)
              setError('')
            }}
          />
          <Button disabled={opened} loading={loading} onClick={handleSubmit}>
            Submit referral code
          </Button>
        </Stack>
      </RwdLayout>

      <Space h={100} />

      {/* Modal content */}
      <Modal opened={opened} onClose={close} title="Confirm your friend" size="lg" centered>
        <Stack gap="xl">
          <Stack align="center">
            <Avatar size="lg" src={user?.details.avatar}>
              {user?.name?.substring(0, 1).toUpperCase()}
            </Avatar>
            <Box ta="center">
              <Title order={4} fw={500}>
                {user?.name || 'No name'}
              </Title>
              <Text fz="xs" c="dimmed">
                {user?.username ? `@${user.username}` : 'Error'}
              </Text>
            </Box>
          </Stack>

          <Group justify="right">
            <Button variant="outline" color="black" onClick={close}>
              Cancel
            </Button>
            <Button>Confirm</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
