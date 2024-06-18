'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Stack, Button, Paper, Table, Group, Divider, ActionIcon, Text } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useActivity } from '@/store/contexts/ActivityContext'
import AddModel, { type AddModalRef } from './AddModal'
import UpdateModal, { type UpdateModalRef } from './UpdateModal'
import DeleteModal, { type DeleteModalRef } from './DeleteModal'
import { PiPencil, PiTrash } from 'react-icons/pi'
import { formateDate } from '@/utils/helper'
import classes from './index.module.css'

export default function AdminEpoch() {
  const addRef = useRef<AddModalRef>(null)
  const updateRef = useRef<UpdateModalRef>(null)
  const deleteRef = useRef<DeleteModalRef>(null)

  const { activities, setSelectedIndex } = useActivity()

  const rows = activities.map(o => (
    <Table.Tr key={o.index}>
      <Table.Td c="blue" fw={500}>
        <Image
          className={classes.thumbnail}
          src="/images/activity-thumbnail.png"
          width={60}
          height={60}
          alt="thumbnail"
        />
      </Table.Td>
      <Table.Td>
        <Text style={{ textOverflow: 'ellipsis', width: 200, overflow: 'hidden' }}>{o.title}</Text>
      </Table.Td>
      <Table.Td>
        <Text>{o.points}</Text>
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
            <span />

            <Button size="xs" onClick={() => addRef.current?.open()}>
              Add Activity
            </Button>
          </Group>
          <Paper pos="relative" withBorder>
            <Table.ScrollContainer className={classes.table} minWidth={400} mih={200}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th miw={80}>Points</Table.Th>
                    <Table.Th>Start</Table.Th>
                    <Table.Th>End</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {!activities.length && (
              <>
                <Text className="absolute-center" ta="center" c="dimmed" mt="md">
                  No activity yet...
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
