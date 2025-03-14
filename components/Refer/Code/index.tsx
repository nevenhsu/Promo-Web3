'use client'

import { useRouter } from '@/i18n/routing'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'
import { usePromo } from '@/hooks/usePromo'
import { useCallbackUrl } from '@/hooks/useCallbackUrl'
import { useAppSelector } from '@/hooks/redux'
import { useDisclosure } from '@mantine/hooks'
import { useReferral } from '@/store/contexts/app/referralContext'
import { Space, Stack, Modal, Avatar, Group, Box } from '@mantine/core'
import { Text, Title, Button, TextInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getRefererByCode } from '@/services/referral'
import { cleanCode } from '@/utils/helper'
import { PiBarcode } from 'react-icons/pi'

export default function ReferCode() {
  const router = useRouter()
  const { callbackPath } = useCallbackUrl()
  const { data } = useAppSelector(state => state.user)
  const { referer, isReferred, createReferralState, createReferral } = useReferral()

  // Get promo code
  const promo = usePromo()
  const [value, setValue] = useState(promo || '')
  const [opened, { open, close }] = useDisclosure(false)

  const [userState, fetchUser] = useAsyncFn(
    async (code: string) => {
      const user = await getRefererByCode(code)

      if (user.username === data.username) {
        throw new Error('You cannot refer yourself.')
      }

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
    if (userState.value?.username) {
      await createReferral(userState.value.username)
    }
    close()
  }

  const handleBack = () => {
    // handle auth callbackUrl
    if (callbackPath) {
      // @ts-ignore
      router.push(callbackPath)
    } else {
      router.push('/activity')
    }
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          {isReferred && referer ? (
            <>
              <Title order={3}>Your Referer</Title>

              <Stack align="center">
                <Avatar
                  size="lg"
                  src={referer.details.avatar}
                  name={referer.name || referer.username}
                  color="initials"
                />
                <Box ta="center">
                  <Title order={4} fw={500}>
                    {referer.name || 'No name'}
                  </Title>
                  <Text fz="xs" c="dimmed">
                    {referer.username ? `@${referer!.username}` : 'Error'}
                  </Text>
                </Box>
              </Stack>

              <Button onClick={handleBack}>Done</Button>
            </>
          ) : (
            <>
              <Title order={3}>Referral Code</Title>
              <TextInput
                leftSection={<PiBarcode size={24} />}
                placeholder="Enter referral code"
                value={value}
                error={
                  userState.error?.response?.data.error ||
                  userState.error?.message ||
                  createReferralState.error?.response?.data.error
                }
                onChange={event => {
                  setValue(cleanCode(event.currentTarget.value.toUpperCase()))
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
        title={
          <Text fz="xl" fw={500}>
            Confirm your friend
          </Text>
        }
        size="lg"
        centered
      >
        <Stack gap="xl">
          <Stack align="center">
            <Avatar
              size="lg"
              src={userState.value?.details.avatar}
              name={userState.value?.name || userState.value?.username}
              color="initials"
            />

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
            <Button variant="outline" color="dark" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isReferred}
              loading={createReferralState.loading}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
