'use client'

import * as _ from 'lodash-es'
import { useState, useEffect, useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import { usePrivy } from '@privy-io/react-auth'
import { useAppSelector } from '@/hooks/redux'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Stack, Paper, Space, Group, Modal, Box } from '@mantine/core'
import { Title, Text, Button, ActionIcon, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { LinkAccountPlatform } from '@/types/db'
import { PiLinkBreak, PiLink, PiEnvelope } from 'react-icons/pi'
import { FcGoogle } from 'react-icons/fc'
import { FaXTwitter, FaInstagram } from 'react-icons/fa6'

enum AccountType {
  Email = 'Email',
  Google = 'Google',
  X = 'X',
  Instagram = 'Instagram',
}

export default function ProfileAccount() {
  const { user, linkEmail, linkGoogle, linkTwitter, linkInstagram } = usePrivy()
  const { unlinkEmail, unlinkGoogle, unlinkTwitter, unlinkInstagram } = usePrivy()

  const { email, google, twitter, instagram } = user || {}
  const { statusData, data } = useAppSelector(state => state.user)
  const locked = !statusData || statusData.progress.ongoing > 0 // prevent unlinking while ongoing

  // auto update username by accessToken
  const linkedInstagram = useMemo(
    () => data.linkedAccounts?.find(account => account.platform === LinkAccountPlatform.Instagram),
    [data]
  )

  // for modal
  const [opened, { open, close }] = useDisclosure(false)
  const [type, setType] = useState<AccountType>()

  // lock social accounts while ongoing
  const showLocked = locked && type && _.includes(statusData?.progress.ongoingSocial, type)

  const [unlinkState, unlink] = useAsyncFn(
    async (type: AccountType) => {
      switch (type) {
        case AccountType.Email: {
          if (!email) return
          const result = await unlinkEmail(email.address)
          return result
        }
        case AccountType.Google: {
          if (!google) return
          const result = await unlinkGoogle(google.subject)
          return result
        }
        case AccountType.X: {
          if (!twitter || showLocked) return
          const result = await unlinkTwitter(twitter.subject)
          return result
        }
        case AccountType.Instagram: {
          if (!instagram) return
          const result = await unlinkInstagram(instagram.subject)
          return result
        }
      }
    },
    [showLocked]
  )

  useEffect(() => {
    // reset type when modal closed
    if (type && !opened) {
      setType(undefined)
    }
  }, [opened, type])

  useEffect(() => {
    if (unlinkState.error) {
      notifications.show({
        title: 'Failed to unlink account',
        message: unlinkState.error.message,
        color: 'red',
      })
    }
  }, [unlinkState.error])

  const handleOpenModal = (type: AccountType) => {
    setType(type)
    open()
  }

  const handleUnlink = async () => {
    if (!type) return
    await unlink(type)
    close()
  }

  const handleLink = (type: AccountType) => {
    switch (type) {
      case AccountType.Email:
        linkEmail()
        break
      case AccountType.Google:
        linkGoogle()
        break
      case AccountType.X:
        linkTwitter()
        break
      case AccountType.Instagram:
        linkInstagram()
        break
    }
  }

  const renderLink = (type: AccountType, linked: boolean, account?: string) => {
    return (
      <Group gap={4} wrap="nowrap">
        {linked ? (
          <>
            <Text className="word-break-all" fz="sm" c="dimmed" ta="right">
              {account}
            </Text>
            <ActionIcon variant="transparent" color="red" onClick={() => handleOpenModal(type)}>
              <PiLinkBreak />
            </ActionIcon>
          </>
        ) : (
          <Button
            onClick={() => handleLink(type)}
            px={0}
            size="compact-sm"
            variant="transparent"
            rightSection={
              <ThemeIcon variant="transparent">
                <PiLink />
              </ThemeIcon>
            }
          >
            Link
          </Button>
        )}
      </Group>
    )
  }

  return (
    <>
      <RwdLayout>
        <Stack>
          <Title order={3} mb="md">
            Link Accounts
          </Title>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <PiEnvelope size={20} />
                <Title order={5} fw={500}>
                  Email
                </Title>
              </Group>

              {renderLink(AccountType.Email, Boolean(email), email?.address)}
            </Group>
          </Paper>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <FcGoogle size={20} />
                <Title order={5} fw={500}>
                  Google
                </Title>
              </Group>

              {renderLink(AccountType.Google, Boolean(google), getEmailAccount(google?.email))}
            </Group>
          </Paper>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <FaXTwitter size={20} />
                <Title order={5} fw={500}>
                  X
                </Title>
              </Group>

              {renderLink(
                AccountType.X,
                Boolean(twitter),
                twitter?.username ? `@${twitter.username}` : undefined
              )}
            </Group>
          </Paper>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <FaInstagram size={20} />
                <Title order={5} fw={500}>
                  Instagram
                </Title>
              </Group>

              {renderLink(
                AccountType.Instagram,
                Boolean(instagram),
                linkedInstagram?.username ? `@${linkedInstagram.username}` : undefined
              )}
            </Group>
          </Paper>
        </Stack>
      </RwdLayout>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fz="xl" fw={500}>
            {`Unlink ${type}`}
          </Text>
        }
        centered
      >
        <Box c="dimmed">
          {showLocked ? (
            <>
              <Text fz="sm">
                You cannot unlink your account while there is an ongoing activity.
              </Text>
            </>
          ) : (
            <>
              <Text fz="xs">You are about to unlink your {type} account.</Text>
              <Text fz="xs">Are you sure you want to proceed?</Text>
            </>
          )}
        </Box>
        <Space h="xl" />
        <Group justify="right">
          <Button onClick={close} variant="outline" color="dark">
            Cancel
          </Button>
          <Button
            onClick={handleUnlink}
            loading={unlinkState.loading}
            disabled={showLocked || !type}
          >
            Unlink
          </Button>
        </Group>
      </Modal>

      <Space h={100} />
    </>
  )
}

function getEmailAccount(email?: string) {
  if (!email) return
  return email.split('@')[0]
}
