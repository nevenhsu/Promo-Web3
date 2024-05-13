'use client'

import { Stack, Button, Paper, Table, Box, Group, Divider, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import classes from './index.module.css'
import { getRoleLabel } from './variables'
import { PiPencil, PiTrash } from 'react-icons/pi'

const elements: Array<{ name: string; role: number; active: boolean }> = [
  { name: 'Super', role: 0, active: true },
  { name: 'Admin', role: 1, active: true },
  { name: 'Admin', role: 1, active: false },
]

export default function AdminUser() {
  const rows = elements.map(element => (
    <Table.Tr key={element.name}>
      <Table.Td fw={500}>{element.name}</Table.Td>
      <Table.Td>{getRoleLabel(element.role)}</Table.Td>
      <Table.Td>
        {element.active ? (
          <Box className={classes.chip} c="blue" bg="blue.1">
            Active
          </Box>
        ) : (
          <Box className={classes.chip} c="gray" bg="gray.1">
            Inactive
          </Box>
        )}
      </Table.Td>
      <Table.Td ta="right">
        <Group justify="right" gap="xs">
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
          <Group justify="right">
            <Button size="xs">Add Admin</Button>
          </Group>
          <Paper withBorder>
            <Table.ScrollContainer minWidth={500}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th ta="right">Actions</Table.Th>
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
