'use client'

import { Link } from '@/i18n/routing'
import { Group, Stack, Space, Card, Text, Title, ActionIcon, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiArrowRight, PiCactus, PiBalloon, PiRocket } from 'react-icons/pi'

export default function Admin() {
  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <CardAction
            icon={<PiCactus size={32} />}
            title="Admin Dashboard"
            description="Manage admin accounts, settings"
            link="/admin/user"
          />

          <CardAction
            icon={<PiRocket size={32} />}
            title="Activity Dashboard"
            description="Manage activities"
            link="/admin/activity"
          />

          {/* <CardAction
            icon={<PiBalloon size={32} />}
            title="Epoch Dashboard"
            description="Manage epoch periods, settings"
            link="/admin/epoch"
          /> */}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
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
      <Card shadow="xs">
        <Group wrap="nowrap" mb="md" py="xs">
          <ThemeIcon variant="white" style={{ flexShrink: 0 }}>
            {icon}
          </ThemeIcon>
          <Stack gap={4}>
            <Title fz={20} fw={500} lh={1}>
              {title}
            </Title>
            <Text fz="sm" c="dimmed">
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
