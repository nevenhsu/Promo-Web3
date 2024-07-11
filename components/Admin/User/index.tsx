'use client'

import { useRef } from 'react'
import { useAdmin } from '@/store/contexts/admin/AdminContext'
import { Stack, Button, Paper, Box, Group, Divider } from '@mantine/core'
import { Table, Text, ActionIcon, Badge } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import AddModel, { type AddModalRef } from './AddModal'
import UpdateModal, { type UpdateModalRef } from './UpdateModal'
import DeleteModal, { type DeleteModalRef } from './DeleteModal'
import { getRoleLabel } from './variables'
import { PiPencil, PiTrash } from 'react-icons/pi'
import classes from './index.module.css'

export default function AdminUser() {
  const addRef = useRef<AddModalRef>(null)
  const updateRef = useRef<UpdateModalRef>(null)
  const deleteRef = useRef<DeleteModalRef>(null)

  const { admins, setSelectedId: setSelectedAdmin } = useAdmin()

  const rows = admins.map(o => (
    <Table.Tr key={o._user._id}>
      <Table.Td fw={500}>
        <>
          <Box lh={1} mb={4}>
            {o._user.name || 'No name'}
          </Box>
          <Box c="dimmed" fz="xs" lh={1}>
            @{o._user.username}
          </Box>
        </>
      </Table.Td>
      <Table.Td>{getRoleLabel(o.role)}</Table.Td>
      <Table.Td>{o.active ? <Badge>Active</Badge> : <Badge color="gray">Inactive</Badge>}</Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            color="dark"
            onClick={() => {
              setSelectedAdmin(o._user._id)
              updateRef.current?.open()
            }}
          >
            <PiPencil />
          </ActionIcon>
          <Divider orientation="vertical" />
          <ActionIcon
            color="red"
            onClick={() => {
              setSelectedAdmin(o._user._id)
              deleteRef.current?.open()
            }}
          >
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
          <Paper pos="relative" withBorder>
            <Table.ScrollContainer className={classes.table} minWidth={500} mih={200}>
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

            {!admins.length && (
              <>
                <Text className="absolute-center" ta="center" c="dimmed" mt="md">
                  No admin yet...
                </Text>
              </>
            )}
          </Paper>
        </Stack>
      </RwdLayout>

      <AddModel ref={addRef} />
      <UpdateModal ref={updateRef} />
      <DeleteModal ref={deleteRef} />
    </>
  )
}
