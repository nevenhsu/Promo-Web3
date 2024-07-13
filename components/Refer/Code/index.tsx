'use client'

import { useRouter } from '@/navigation'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useAppSelector } from '@/hooks/redux'
import { useDisclosure } from '@mantine/hooks'
import { useReferral } from '@/store/contexts/user/referralContext'
import { Space, Stack, Modal, Avatar, Group, Box } from '@mantine/core'
import { Text, Title, Button, TextInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getPublicUser } from '@/services/user'
import { PiBarcode } from 'react-icons/pi'

export default function ReferCode() {
  const router = useRouter()
  const { data, _id } = useAppSelector(state => state.user)
  const { referer, isReferred, createState, createReferral } = useReferral()
  const [value, setValue] = useState('')
  const [opened, { open, close }] = useDisclosure(false)

  const [userState, fetchUser] = useAsyncFn(
    async (username: string) => {
      if (username === data.username) {
        throw new Error('You cannot refer yourself.')
      }

      const user = await getPublicUser(username)

      if (user) {
        open()
      } else {
        throw new Error('User not found. Please check the code.')
      }

      return user
    },
    [data]
  )

  const handleSubmit = () => {
    if (isReferred) return

    if (value === userState.value?.username) {
      open()
      return
    }

    if (value) {
      fetchUser(value)
    }
  }

  const handleConfirm = async () => {
    if (value) {
      await createReferral(value)
    }
    close()
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          {isReferred ? (
            <>
              <Title order={3}>Your Referer</Title>

              <Stack align="center">
                <Avatar size="lg" src={referer!.details.avatar}>
                  {referer!.name?.substring(0, 1).toUpperCase()}
                </Avatar>
                <Box ta="center">
                  <Title order={4} fw={500}>
                    {referer!.name || 'No name'}
                  </Title>
                  <Text fz="xs" c="dimmed">
                    {referer!.username ? `@${referer!.username}` : 'Error'}
                  </Text>
                </Box>
              </Stack>

              <Button onClick={() => router.back()}>Back</Button>
            </>
          ) : (
            <>
              <Title order={3}>Referral Code</Title>
              <TextInput
                leftSection={<PiBarcode size={24} />}
                placeholder="Enter referral code"
                value={value}
                error={userState.error?.message}
                onChange={event => {
                  setValue(event.currentTarget.value)
                }}
              />
              <Button disabled={opened} loading={userState.loading} onClick={handleSubmit}>
                Submit referral code
              </Button>
            </>
          )}
        </Stack>
      </RwdLayout>

      <Space h={100} />

      {/* Modal content */}
      <Modal
        opened={opened && !isReferred}
        onClose={close}
        title="Confirm your friend"
        size="lg"
        centered
      >
        <Stack gap="xl">
          <Stack align="center">
            <Avatar size="lg" src={userState.value?.details.avatar}>
              {userState.value?.name?.substring(0, 1).toUpperCase()}
            </Avatar>
            <Box ta="center">
              <Title order={4} fw={500}>
                {userState.value?.name || 'No name'}
              </Title>
              <Text fz="xs" c="dimmed">
                {userState.value?.username ? `@${userState.value.username}` : 'Error'}
              </Text>
            </Box>
          </Stack>

          <Group justify="right">
            <Button variant="outline" color="black" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isReferred} loading={createState.loading}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
