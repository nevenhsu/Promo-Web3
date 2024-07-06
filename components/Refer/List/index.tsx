'use client'

import { Space, Stack, Group, Box, Paper, Tabs } from '@mantine/core'
import { ThemeIcon, Text, Title, Avatar } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

export default function ReferList() {
  return (
    <>
      <RwdLayout>
        <Space h={16} />

        <Stack gap={8}>
          <Title order={3}>You’ve invited 45 friends & 1.4k friends’ friends</Title>
          <Text fz="sm" c="dimmed">
            Keep inviting friends to earn more!
          </Text>
        </Stack>

        <Space h={40} />

        <Tabs defaultValue="first">
          <Tabs.List>
            <Tabs.Tab value="first">Friends</Tabs.Tab>
            <Tabs.Tab value="second">Friends’ Friends</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="first">
            <Box py={24}>
              <Stack>
                <Paper p={16} shadow="xs">
                  <Group justify="space-between">
                    <Group>
                      <Avatar>JD</Avatar>
                      <Box>
                        <Text fw={500}>John Doe</Text>
                        <Text fz="xs" c="dimmed">
                          @username
                        </Text>
                      </Box>
                    </Group>
                    <Box ta="right">
                      <Text fw={500} c="orange">
                        200
                      </Text>
                      <Text fz="xs" c="dimmed">
                        6 Jul 2024
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Stack>
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <Box py={24}>
              <Stack>
                <Paper p={16} shadow="xs">
                  <Group justify="space-between">
                    <Group>
                      <Avatar>AD</Avatar>
                      <Box>
                        <Text fw={500}>Alex Doe</Text>
                        <Text fz="xs" c="dimmed">
                          @username
                        </Text>
                      </Box>
                    </Group>
                    <Box ta="right">
                      <Text fw={500} c="orange">
                        500
                      </Text>
                      <Text fz="xs" c="dimmed">
                        3 Jul 2024
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Stack>
            </Box>
          </Tabs.Panel>
        </Tabs>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
