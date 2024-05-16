'use client'

import { format } from 'date-fns-tz'
import { Stack, Button, Paper, Table, Group, Divider, ActionIcon, Text } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiPencil, PiTrash } from 'react-icons/pi'
import { publicEnv } from '@/utils/env'

const { timeZone } = publicEnv

const elements: Array<{ index: number; startTime: Date; endTime: Date }> = [
  {
    index: 1,
    startTime: new Date('2024-03-25T05:00:00Z'),
    endTime: new Date('2024-04-01T05:00:00Z'),
  },
  {
    index: 0,
    startTime: new Date('2024-03-18T05:00:00Z'),
    endTime: new Date('2024-03-25T05:00:00Z'),
  },
]

function getGMT(date: Date) {
  const formattedDate = format(date, 'h:mm aa zzz', {
    timeZone,
  })
  return formattedDate
}

function formateTime(date: Date) {
  const formattedDate = format(date, 'MMM dd yyyy', {
    timeZone,
  })
  return formattedDate
}

export default function AdminUser() {
  const gmt = elements.length ? getGMT(elements[0].startTime) : ''

  const rows = elements.map(el => (
    <Table.Tr key={el.index}>
      <Table.Td c="blue" fw={500}>
        {el.index}
      </Table.Td>
      <Table.Td fz="sm">{formateTime(el.startTime)}</Table.Td>
      <Table.Td fz="sm">{formateTime(el.endTime)}</Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ActionIcon>
            <PiPencil />
          </ActionIcon>
          <Divider orientation="vertical" />
          <ActionIcon c="red">
            <PiTrash />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <>
      <RwdLayout>
        <Stack>
          <Group justify="space-between">
            <Stack gap={4}>
              <Text fz="sm">{timeZone}</Text>
              <Text fz="xs" c="dimmed">
                {gmt}
              </Text>
            </Stack>

            <Button size="xs">Add Epoch</Button>
          </Group>
          <Paper withBorder>
            <Table.ScrollContainer minWidth={400}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Index</Table.Th>
                    <Table.Th>Start</Table.Th>
                    <Table.Th>End</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Stack>
      </RwdLayout>
    </>
  )
}
