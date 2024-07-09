'use client'

import { Link } from '@/navigation'
import { Group, Stack, Text, Card, Box, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiArrowRight, PiCactus, PiBalloon, PiLightning } from 'react-icons/pi'

export default function Admin() {
  return (
    <RwdLayout>
      <Stack gap="xl">
        <CardAction
          icon={<PiCactus size={32} />}
          title="Admin Dashboard"
          description="Manage admin accounts, settings"
          link="/admin/user"
        />
        <CardAction
          icon={<PiBalloon size={32} />}
          title="Epoch Dashboard"
          description="Manage epoch periods, settings"
          link="/admin/epoch"
        />
        <CardAction
          icon={<PiLightning size={32} />}
          title="Activity Dashboard"
          description="Manage activities"
          link="/admin/activity"
        />
      </Stack>
    </RwdLayout>
  )
}

type CardActionProps = {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

function CardAction(props: CardActionProps) {
  const { title, description, icon, link } = props
  return (
    <>
      <Card withBorder>
        <Group wrap="nowrap" mb="md" py="xs">
          <Box c="blue" style={{ flexShrink: 0 }}>
            {icon}
          </Box>
          <Stack gap={4}>
            <Text fz={20} fw={500} lh={1}>
              {title}
            </Text>
            <Text fz="sm" c="dimmed" lh={1}>
              {description}
            </Text>
          </Stack>
        </Group>

        <Card.Section withBorder inheritPadding py={4}>
          <Group justify="right">
            {/* @ts-expect-error */}
            <Link href={link}>
              <ActionIcon>
                <PiArrowRight />
              </ActionIcon>
            </Link>
          </Group>
        </Card.Section>
      </Card>
    </>
  )
}
