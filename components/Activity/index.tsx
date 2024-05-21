'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Chip, Group, ScrollArea, Stack, Paper, Text, Space, Divider, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiXLogo } from 'react-icons/pi'
import { chips } from './variables'
import classes from './index.module.css'

export default function Activity() {
  const [chip, setChip] = useState('0')
  const activityId = 'testid' as string

  return (
    <>
      <ScrollArea scrollbars="x" type="never">
        <Chip.Group multiple={false} value={chip} onChange={setChip}>
          <Group p="md" gap={4} wrap="nowrap">
            {chips.map(el => (
              <Chip
                key={el.value}
                variant={el.value === chip ? 'filled' : 'outline'}
                value={el.value}
              >
                {el.label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </ScrollArea>

      <RwdLayout pt={16}>
        <Stack>
          <Paper p="sm" className={classes.card}>
            <Stack>
              <Group gap="sm" wrap="nowrap">
                <Image
                  className={classes.thumbnail}
                  src="/images/activity-thumbnail.png"
                  width={64}
                  height={64}
                  alt="thumbnail"
                />
                <Stack gap={4} className={classes.content}>
                  <Group justify="space-between" wrap="nowrap" gap="sm">
                    <Text fz="md" fw={500}>
                      Taitra Tech Promotion
                    </Text>
                    <PiXLogo className={classes.logo} size={24} />
                  </Group>
                  <Text fz="xs" c="dimmed">
                    20 May 2024
                  </Text>
                  <Text fz="xs" c="dimmed">
                    Repost on X
                  </Text>
                </Stack>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text fw={700} c="orange.6">
                  200 Points
                </Text>

                {/* @ts-expect-error */}
                <Link href={`/activity/${activityId}`}>
                  <Button>Join Now</Button>
                </Link>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
