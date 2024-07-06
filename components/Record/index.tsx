'use client'

import { Group, Stack, Paper, Center, Text, Space, Box, Tabs } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import LevelCard from '@/components/share/LevelCard'
import { PiMedalFill, PiLightning } from 'react-icons/pi'
import classes from './index.module.css'

export default function Record() {
  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Paper p="lg" c="white" radius="xl" bg="blue">
            <Group gap="lg">
              <Center className={classes.medal} bg="orange.4">
                <PiMedalFill size={24} />
              </Center>
              <Stack gap={4}>
                <Text fw={700}>66000 points</Text>
                <Text fz="xs">Level Gold</Text>
              </Stack>
            </Group>
          </Paper>

          <LevelCard points={66000} />

          <Space h={1} />

          <Box w="100%">
            <Tabs className={classes.tabs} variant="pills" defaultValue="asset" radius="xl">
              <Tabs.Tab value="asset">Point</Tabs.Tab>
              <Tabs.Tab value="activity">Bonus</Tabs.Tab>
            </Tabs>
          </Box>

          <Stack>
            {/* Item */}
            <Paper p="sm">
              <Text fz={10} c="dimmed" mb="xs">
                4 Mar 2024 10:04 AM
              </Text>

              <Group c="orange" justify="space-between">
                <Group>
                  <Box>
                    <PiLightning size={24} />
                  </Box>
                  <Stack gap={4}>
                    <Text c="var(--mantine-color-text)">Repost on X</Text>
                    <Text fz="xs" fw={500}>
                      Confirmed
                    </Text>
                  </Stack>
                </Group>

                <Text ta="right">+ 200</Text>
              </Group>
            </Paper>

            {/* Item */}
            <Paper p="sm">
              <Text fz={10} c="dimmed" mb="xs">
                2 Mar 2024 8:04 AM
              </Text>

              <Group justify="space-between" c="blue">
                <Group>
                  <Box>
                    <PiLightning size={24} />
                  </Box>
                  <Stack gap={4}>
                    <Text c="var(--mantine-color-text)">Refer a friend</Text>
                    <Text fz="xs" fw={500}>
                      Pending
                    </Text>
                  </Stack>
                </Group>

                <Text ta="right">+ 100</Text>
              </Group>
            </Paper>
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
