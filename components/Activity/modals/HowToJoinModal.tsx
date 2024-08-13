import { Modal, Text, Timeline } from '@mantine/core'
import {
  PiCircleDashedBold,
  PiLinkSimpleHorizontalBold,
  PiImageSquareBold,
  PiShareFatBold,
  PiCursorClickBold,
} from 'react-icons/pi'

type HowToJoinModalProps = {
  opened: boolean
  onClose: () => void
  activeStep: number
}

export function HowToJoinModal({ opened, onClose, activeStep }: HowToJoinModalProps) {
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
          title="Open the post link"
        >
          <Text c="dimmed" size="sm">
            Open the post on the social media app
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 2 ? 'solid' : 'dashed'}
          bullet={<PiShareFatBold size={14} />}
          title="Share the post"
        >
          <Text c="dimmed" size="sm">
            Share the post to your feed
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 3 ? 'solid' : 'dashed'}
          bullet={<PiCursorClickBold size={14} />}
          title="Click confirmation button"
        >
          <Text c="dimmed" size="sm">
            Click the button to confirm your participation
          </Text>
        </Timeline.Item>

        <Timeline.Item
          lineVariant={activeStep > 4 ? 'solid' : 'dashed'}
          bullet={<PiCircleDashedBold size={14} />}
          title="Wait for confirmation"
        >
          <Text c="dimmed" size="sm">
            Wait for confirmation to get your score
          </Text>
        </Timeline.Item>
      </Timeline>
    </Modal>
  )
}
