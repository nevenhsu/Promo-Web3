'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Modal, Stack, Box, Text } from '@mantine/core'
import LinkButton from './LinkButton'
import { toUpper } from '@/utils/helper'
import { SocialMedia } from '@/types/db'

type LinkModalProps = {
  platform: string
  opened: boolean
  onClose: () => void
}

export default function LinkModal({ platform, opened, onClose }: LinkModalProps) {
  const { user, linkTwitter, linkInstagram } = usePrivy()
  const { twitter, instagram } = user || {}
  const platformUpper = toUpper(platform)

  const handleLink = () => {
    switch (platform) {
      case SocialMedia.X: {
        twitter ? onClose() : linkTwitter()
        break
      }
      case SocialMedia.Instagram: {
        instagram ? onClose() : linkInstagram()
        break
      }
    }
    return
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <Text fz="xl" fw={500}>
            Link social account
          </Text>
        }
        centered
      >
        <Stack gap="xl">
          <Box>
            <Text fz="sm" mb="xs">
              Please stay on browser to ensure a smooth connection of your {platformUpper} account.
            </Text>
            <Text fz="sm" c="red">
              Connecting via app may result in issues.
            </Text>
          </Box>
          <LinkButton platform={platform} onLink={handleLink} />
        </Stack>
      </Modal>
    </>
  )
}
