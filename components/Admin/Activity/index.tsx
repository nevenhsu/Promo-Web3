'use client'

import { useRef } from 'react'
import { isAfter } from 'date-fns'
import { Stack, Paper, Table, Group, Divider } from '@mantine/core'
import { Button, ActionIcon, Text, Box, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useActivity } from '@/store/contexts/admin/ActivityContext'
import AddModel, { type AddModalRef } from './AddModal'
import UpdateModal, { type UpdateModalRef } from './UpdateModal'
import DeleteModal, { type DeleteModalRef } from './DeleteModal'
import { PiCheckCircle, PiXCircle, PiPencil, PiTrash } from 'react-icons/pi'
import { PiPauseFill, PiPlayFill, PiStopFill } from 'react-icons/pi'
import { formatZonedDate } from '@/utils/helper'
import { formatNumber } from '@/utils/math'
import classes from './index.module.css'

export default function AdminEpoch() {
  const addRef = useRef<AddModalRef>(null)
  const updateRef = useRef<UpdateModalRef>(null)
  const deleteRef = useRef<DeleteModalRef>(null)

  const { activities, setSelectedIndex } = useActivity()

  const rows = activities.map(o => {
    const ended = isAfter(new Date(), o.endTime)
    return (
      <Table.Tr key={o.index}>
        <Table.Td>
          <ThemeIcon variant="white" color={o.published ? (ended ? 'black' : 'green') : 'red'}>
            {o.published ? (
              ended ? (
                <PiStopFill size={20} />
              ) : (
                <PiPlayFill size={20} />
              )
            ) : (
              <PiPauseFill size={20} />
            )}
          </ThemeIcon>
        </Table.Td>
        <Table.Td>
          <Text style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{o.title}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{`${formatNumber(o.airdrop.amount)} ${o.airdrop.symbol}`}</Text>
        </Table.Td>
        <Table.Td fz="sm">
          <Text fz={14}>{formatZonedDate(o.startTime)}</Text>
          <Text fz={12} c="dimmed">
            {formatZonedDate(o.startTime, 'h:mm aa zzz')}
          </Text>
        </Table.Td>
        <Table.Td fz="sm">
          <Text fz={14}> {formatZonedDate(o.endTime)}</Text>
          <Text fz={12} c="dimmed">
            {formatZonedDate(o.endTime, 'h:mm aa zzz')}
          </Text>
        </Table.Td>
        <Table.Td fz="sm">
          <ThemeIcon size="sm" variant="transparent">
            {o.airdrop.finalized ? (
              <PiCheckCircle size={20} color="green" />
            ) : (
              <PiXCircle size={20} color="red" />
            )}
          </ThemeIcon>
        </Table.Td>

        <Table.Td>
          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              onClick={() => {
                setSelectedIndex(o.index)
                updateRef.current?.open()
              }}
              color="blue"
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
    )
  })

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
                    <Table.Th>Airdrop</Table.Th>
                    <Table.Th>Start</Table.Th>
                    <Table.Th>End</Table.Th>
                    <Table.Th>Finalize</Table.Th>
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
