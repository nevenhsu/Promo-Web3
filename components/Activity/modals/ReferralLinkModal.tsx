'use client'

import * as _ from 'lodash-es'
import { useAppSelector } from '@/hooks/redux'
import { Stack, Paper, Modal, Text, Button, CopyButton } from '@mantine/core'

type ReferralLinkModalProps = {
  slug: string
  opened: boolean
  onClose: () => void
}

export function ReferralLinkModal({ slug, opened, onClose }: ReferralLinkModalProps) {
  // User data
  const { referralData } = useAppSelector(state => state.user)
  const { code } = referralData || {}

  const getPromoLink = (code: string) => {
    return `${window.location.origin}/activity/${slug}?promo=${code}`
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fz="xl" fw={500}>
          Activity referral link
        </Text>
      }
      centered
      styles={{
        header: {
          background: 'none',
        },
        content: {
          background: 'var(--my-color-bg)',
        },
      }}
    >
      <Stack gap="lg">
        <Text fz="sm" c="dimmed">
          Share this activity to your friends and earn more score
        </Text>

        {/* Link */}
        <Paper p="xs" ta="center" c="orange" bd="1px dashed red" mb="sm">
          <Text fz="sm" fw={500}>
            {code ? getPromoLink(code) : 'Loading...'}
          </Text>
        </Paper>

        <CopyButton value={code ? getPromoLink(code) : ''}>
          {({ copied, copy }) => (
            <Button size="md" onClick={copy} loading={!code}>
              {copied ? 'Copied' : 'Copy my invite link'}
            </Button>
          )}
        </CopyButton>
      </Stack>
    </Modal>
  )
}
