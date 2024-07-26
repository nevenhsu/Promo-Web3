'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Modal, Stack, Box, Text } from '@mantine/core'
import LinkButton from './LinkButton'
import { toUpper } from '@/utils/helper'

type LinkModalProps = {
  platform: string
  opened: boolean
  onClose: () => void
}

export default function LinkModal({ platform, opened, onClose }: LinkModalProps) {
  const { user, linkTwitter } = usePrivy()
  const { twitter } = user || {}
  const platformUpper = toUpper(platform)

  const handleLink = () => {
    twitter ? onClose() : linkTwitter()
  }

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Link social account" centered>
        <Stack gap="xl">
          <Box>
            <Text fz="sm" mb="xs">
              Please use a computer to ensure a smooth connection of your {platformUpper} account.
            </Text>
            <Text fz="sm" c="red">
              Connecting via a mobile device may result in issues.
            </Text>
          </Box>
          <LinkButton platform={platform} onLink={handleLink} />
        </Stack>
      </Modal>
    </>
  )
}
