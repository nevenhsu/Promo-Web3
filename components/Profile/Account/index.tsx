'use client'

import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { usePrivy } from '@privy-io/react-auth'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Stack, Paper, Space, Group, Modal, Box } from '@mantine/core'
import { Title, Text, Button, ActionIcon, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLinkBreak, PiLink } from 'react-icons/pi'

enum AccountType {
  Email = 'Email',
  Google = 'Google',
  X = 'X',
}

export default function ProfileAccount() {
  const [opened, { open, close }] = useDisclosure(false)
  const [type, setType] = useState<AccountType>() // for modal

  const { user, linkEmail, linkGoogle, linkTwitter } = usePrivy()
  const { unlinkEmail, unlinkGoogle, unlinkTwitter } = usePrivy()
  const { email, google, twitter } = user || {}

  const [unlinkState, unlink] = useAsyncFn(async (type: AccountType) => {
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
        if (!twitter) return
        const result = await unlinkTwitter(twitter.subject)
        return result
      }
    }
  }, [])

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
    }
  }

  const renderLink = (type: AccountType, account?: string) => {
    return (
      <Group gap={4}>
        {account ? (
          <>
            <Text fz="sm" c="dimmed">
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
            <Group justify="space-between">
              <Title order={5} fw={500}>
                Email
              </Title>

              {renderLink(AccountType.Email, email?.address)}
            </Group>
          </Paper>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between">
              <Title order={5} fw={500}>
                Google
              </Title>

              {renderLink(AccountType.Google, getEmailAccount(google?.email))}
            </Group>
          </Paper>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between">
              <Title order={5} fw={500}>
                X
                <Text mx="xs" fz="xs" component="span" c="dimmed">
                  Twitter
                </Text>
              </Title>

              {renderLink(AccountType.X, twitter?.name || twitter?.username || twitter?.subject)}
            </Group>
          </Paper>
        </Stack>
      </RwdLayout>

      <Modal opened={opened} onClose={close} title={`Unlink ${type}`} centered>
        <Stack gap="xs" c="dimmed">
          <Text fz="xs">Are you sure you want to unlink your {type} account?</Text>
          <Text fz="xs">You will not be able to sign in with this account anymore.</Text>
        </Stack>
        <Space h="xl" />
        <Group justify="right">
          <Button onClick={close} variant="outline" color="black">
            Cancel
          </Button>
          <Button onClick={handleUnlink} loading={unlinkState.loading} disabled={!type}>
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
