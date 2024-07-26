'use client'

import { Link } from '@/navigation'
import { Group, Stack, Paper, Space, Box, Tabs, Divider } from '@mantine/core'
import { Title, Text, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

enum TabValue {
  Score = 'Score',
  Airdrop = 'Airdrop',
}

export default function Record() {
  return (
    <>
      <RwdLayout>
        <Tabs defaultValue={TabValue.Score}>
          <Tabs.List>
            <Tabs.Tab value={TabValue.Score}>Score</Tabs.Tab>
            <Tabs.Tab value={TabValue.Airdrop}>Airdrop</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.Score}>
            <Stack py={40}>
              <Paper px="md" radius="sm" shadow="xs">
                <Group wrap="nowrap" align="stretch">
                  {/* Left */}
                  <Stack py="md" justify="space-between" w={56} flex="1 0 auto">
                    <Box ta="center">
                      <Text fz="sm" lh={1}>
                        Score
                      </Text>
                      <Title className="nowrap" order={3} c="orange">
                        12.8k
                      </Title>
                    </Box>
                    <Text ta="center" fz="xs" c="dimmed">
                      Ongoing
                    </Text>
                  </Stack>

                  <Divider orientation="vertical" />

                  {/* Right */}
                  <Stack gap={32} py="md" w="100%">
                    <Title order={4} fw={500} mb={8} mt={-4} lh={1.25}>
                      Headline
                    </Title>

                    <Group justify="space-between">
                      <Group gap={24}>
                        <Box ta="center">
                          <Text fz="xs">12.6k</Text>
                          <Text fz="xs" c="dimmed">
                            Gain
                          </Text>
                        </Box>
                        <Box ta="center">
                          <Text fz="xs">1.2k</Text>
                          <Text fz="xs" c="dimmed">
                            Bonus
                          </Text>
                        </Box>
                      </Group>
                      <Link
                        href={{
                          pathname: '/activity/[slug]',
                          params: { slug: '1' },
                        }}
                      >
                        <Button>View</Button>
                      </Link>
                    </Group>
                  </Stack>
                </Group>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Airdrop}>
            <></>
          </Tabs.Panel>
        </Tabs>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
