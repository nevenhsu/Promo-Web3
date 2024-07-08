import { Link } from '@/navigation'
import { Tabs, Group, Stack, Paper, Box, Space, Divider } from '@mantine/core'
import { Title, Text, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiXLogo } from 'react-icons/pi'
import classes from './index.module.css'

enum TabValue {
  All = 'all',
  Joined = 'joined',
  Unjoin = 'unjoin',
}

export default function Activity() {
  return (
    <>
      <RwdLayout>
        <Tabs defaultValue={TabValue.All}>
          <Tabs.List>
            <Tabs.Tab value={TabValue.All}>All</Tabs.Tab>
            <Tabs.Tab value={TabValue.Joined}>Joined</Tabs.Tab>
            <Tabs.Tab value={TabValue.Unjoin}>Unjoin</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.All}>
            <Stack py={40}>
              <Paper px="md" radius="sm" shadow="xs">
                <Group wrap="nowrap" align="stretch">
                  <Stack py="md" justify="space-between">
                    <Box ta="center">
                      <Text fz="sm">USDC</Text>
                      <Title c="orange">100</Title>
                    </Box>
                    <Text fz="xs" c="dimmed">
                      6 Jun 2024
                    </Text>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack gap={32} py="md">
                    <Box>
                      <Title order={4} fw={500} lh={1} mb={8}>
                        Headline
                      </Title>
                      <Text fz="sm" c="dark">
                        Please add your content here. Keep it short and simple. And smile
                      </Text>
                    </Box>

                    <Group justify="space-between">
                      <Group gap={24}>
                        <Box ta="center">
                          <Text fz="xs" c="dimmed">
                            Platform
                          </Text>
                          <Text fz="sm">X</Text>
                        </Box>
                        <Box ta="center">
                          <Text fz="xs" c="dimmed">
                            Action
                          </Text>
                          <Text fz="sm">Repost</Text>
                        </Box>
                      </Group>
                      <Link
                        href={{
                          pathname: '/activity/[activityId]',
                          params: { activityId: '1' },
                        }}
                      >
                        <Button>Join</Button>
                      </Link>
                    </Group>
                  </Stack>
                </Group>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
