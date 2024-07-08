import { getTweet as _getTweet } from 'react-tweet/api'
import { Group, Stack, Box, Title, Text, Space, Divider, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLightning, PiPersonSimpleRun, PiTrophy } from 'react-icons/pi'
import classes from '../index.module.css'

type ActivityDetailProps = { activityId: string; children?: React.ReactNode }

export default function ActivityDetail({ activityId, children }: ActivityDetailProps) {
  console.log({ activityId })

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Box>
            <Text c="dimmed" fz="xs">
              6 Jun 2024 ~ 31 Jul 2024
            </Text>
            <Title order={3}>Taitra Tech Promotion</Title>
          </Box>

          <Text fz="sm" c="dark">
            RAMAYANA BALLET at Purawisata – Jogjakarta – Indonesia, has held the record for
            every-night stage without ever being off for 42 YEARS, and received an award from The
            Indonesia Records Museum (MURI) in 2001.
          </Text>

          <Title order={4} c="orange">
            200 USDC
          </Title>

          <>
            <Divider />
            <Title order={6}>Event Details</Title>
            <Stack gap="xs">
              <Group gap="xs">
                <PiLightning size={20} />
                <Text fz="sm">Repost on X</Text>
              </Group>

              <Group gap="xs">
                <PiPersonSimpleRun size={20} />
                <Text fz="sm"> 123 Participants</Text>
              </Group>

              <Group gap="xs">
                <PiTrophy size={20} />
                <Text fz="sm">1.8k Total score</Text>
              </Group>
            </Stack>
            <Divider />
          </>

          <Stack>
            <Button variant="outline">Open link</Button>
            <Button>Mark completed</Button>
          </Stack>

          {/* Embedded Post */}
          {children}
        </Stack>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
