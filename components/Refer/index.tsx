import { Link } from '@/navigation'
import { Space, Divider, Stack, Group, Box, ThemeIcon, Text, Title, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiRocketLaunch } from 'react-icons/pi'

export default function Refer() {
  return (
    <>
      <RwdLayout>
        <Space h={16} />

        <Stack gap={40}>
          <Title order={3} ta="center">
            Invite Friends
            <br />
            Earn bonus score!
          </Title>

          <Divider />

          <Stack gap={24}>
            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Invite your friends
                </Title>
                <Text size="sm" c="dimmed">
                  Refer your friends & earn up to 10% bonus every time they gain score
                </Text>
              </Box>
            </Group>

            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Earn more bonus score
                </Title>
                <Text size="sm" c="dimmed">
                  Earn up to 1% bonus every time your friends’ friends gain score
                </Text>
              </Box>
            </Group>
          </Stack>

          <Stack gap={24}>
            <Button size="md">Share my invite link</Button>

            <Link href="/refer/list">
              <Button size="md" variant="light" w="100%">
                View my friends
              </Button>
            </Link>
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
