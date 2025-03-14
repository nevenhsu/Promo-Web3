import { Modal, Text, Timeline } from '@mantine/core'
import { getActionLabel } from '../variables'
import {
  PiCircleDashedBold,
  PiLinkSimpleHorizontalBold,
  PiImageSquareBold,
  PiShareFatBold,
  PiCursorClickBold,
} from 'react-icons/pi'
import type { TPublicActivity } from '@/models/activity'

type HowToJoinModalProps = {
  activity: TPublicActivity
  opened: boolean
  onClose: () => void
  activeStep: number
}

export function HowToJoinModal(props: HowToJoinModalProps) {
  const { activity, opened, onClose, activeStep } = props
  const actionLabel = getActionLabel(activity.activityType)

  return (
    <Modal opened={opened} onClose={onClose} title="How to join?" centered>
      <Timeline active={activeStep} bulletSize={24} lineWidth={2} pb="md">
        <Timeline.Item
          lineVariant={activeStep > 0 ? 'solid' : 'dashed'}
          bullet={<PiLinkSimpleHorizontalBold size={14} />}
          title="Link social account"
        >
          <Text c="dimmed" size="sm">
            Link your social account to get started
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 1 ? 'solid' : 'dashed'}
          bullet={<PiImageSquareBold size={14} />}
          title="Open the post"
        >
          <Text c="dimmed" size="sm">
            Go to the post on the social media app
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 2 ? 'solid' : 'dashed'}
          bullet={<PiShareFatBold size={14} />}
          title={actionLabel}
        >
          <Text c="dimmed" size="sm">
            Share the post with your linked account
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 3 ? 'solid' : 'dashed'}
          bullet={<PiCursorClickBold size={14} />}
          title="Hit claim button"
        >
          <Text c="dimmed" size="sm">
            Claim your prize after sharing the post
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 4 ? 'solid' : 'dashed'}
          bullet={<PiCircleDashedBold size={14} />}
          title="Wait for confirmation"
        >
          <Text c="dimmed" size="sm">
            We will check your post if it meets the requirements
          </Text>
        </Timeline.Item>
      </Timeline>
    </Modal>
  )
}
