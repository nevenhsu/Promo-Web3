'use client'

import { useRef } from 'react'
import { Stack, Button, Paper, Table, Box, Group, Divider, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import AddModel, { type AddModalRef } from './AddModal'
import UpdateModal, { type UpdateModalRef } from './UpdateModal'
import DeleteModal, { type DeleteModalRef } from './DeleteModal'
import classes from './index.module.css'
import { getRoleLabel } from './variables'
import { PiPencil, PiTrash } from 'react-icons/pi'

const elements: Array<{ username: string; name: string; role: number; active: boolean }> = [
  { username: '1', name: 'Super', role: 0, active: true },
  { username: '2', name: 'Admin', role: 1, active: true },
  { username: '3', name: 'Admin', role: 1, active: false },
]

export default function AdminUser() {
  const addRef = useRef<AddModalRef>(null)
  const updateRef = useRef<UpdateModalRef>(null)
  const deleteRef = useRef<DeleteModalRef>(null)

  const rows = elements.map(element => (
    <Table.Tr key={element.username}>
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
      <Table.Td>
        <Group gap="xs">
          <ActionIcon onClick={() => updateRef.current?.open()}>
            <PiPencil />
          </ActionIcon>
          <Divider orientation="vertical" />
          <ActionIcon c="red" onClick={() => deleteRef.current?.open()}>
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
            <Button size="xs" onClick={() => addRef.current?.open()}>
              Add Admin
            </Button>
          </Group>
          <Paper withBorder>
            <Table.ScrollContainer minWidth={500}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Stack>
      </RwdLayout>

      <AddModel ref={addRef} />
      <UpdateModal ref={updateRef} username="test" name="Alex Dev" active={true} />
      <DeleteModal ref={deleteRef} username="test" name="Alex Dev" />
    </>
  )
}
