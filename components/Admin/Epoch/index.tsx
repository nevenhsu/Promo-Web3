'use client'

import { isAfter } from 'date-fns'
import { useRef } from 'react'
import { Stack, Button, Paper, Table, Group, Divider, ActionIcon, Text } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useEpoch } from '@/store/contexts/admin/EpochContext'
import AddModel, { type AddModalRef } from './AddModal'
import UpdateModal, { type UpdateModalRef } from './UpdateModal'
import DeleteModal, { type DeleteModalRef } from './DeleteModal'
import { PiPencil, PiTrash } from 'react-icons/pi'
import { formateDate } from '@/utils/helper'
import { publicEnv } from '@/utils/env'
import classes from './index.module.css'

export default function AdminEpoch() {
  const addRef = useRef<AddModalRef>(null)
  const updateRef = useRef<UpdateModalRef>(null)
  const deleteRef = useRef<DeleteModalRef>(null)

  const { epochs, setSelectedIndex } = useEpoch()
  const lastEpoch = epochs[0] // possibly undefined

  const rows = epochs.map(o => (
    <Table.Tr key={o.index}>
      <Table.Td c="blue" fw={500}>
        {o.index}
      </Table.Td>
      <Table.Td fz="sm">
        <Text fz={14}>{formateDate(o.startTime)}</Text>
        <Text fz={12} c="dimmed">
          {formateDate(o.startTime, 'h:mm aa zzz')}
        </Text>
      </Table.Td>
      <Table.Td fz="sm">
        <Text fz={14}> {formateDate(o.endTime)}</Text>
        <Text fz={12} c="dimmed">
          {formateDate(o.endTime, 'h:mm aa zzz')}
        </Text>
      </Table.Td>

      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            onClick={() => {
              setSelectedIndex(o.index)
              updateRef.current?.open()
            }}
            disabled={isAfter(new Date(), o.endTime)}
          >
            <PiPencil />
          </ActionIcon>
          <Divider orientation="vertical" />
          <ActionIcon
            color="red"
            onClick={() => {
              setSelectedIndex(o.index)
              deleteRef.current?.open()
            }}
            disabled={o.index !== lastEpoch?.index || isAfter(new Date(), o.startTime)}
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
          <Group justify="space-between">
            <Stack gap={4}>
              <Text fz="sm">{publicEnv.timezone}</Text>
            </Stack>

            <Button size="xs" onClick={() => addRef.current?.open()}>
              Add Epoch
            </Button>
          </Group>
          <Paper pos="relative" withBorder>
            <Table.ScrollContainer className={classes.table} minWidth={400} mih={200}>
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

            {!epochs.length && (
              <>
                <Text className="absolute-center" ta="center" c="dimmed" mt="md">
                  No epoch yet...
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
