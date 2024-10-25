'use client'

import { useRef } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Checkbox, Text } from '@mantine/core'
import { useEpoch } from '@/store/contexts/admin/EpochContext'
import { formatZonedDate } from '@/utils/helper'

export type DeleteModalRef = {
  open: () => void
}

export default forwardRef<DeleteModalRef, {}>(function AddModal(props, ref) {
  const checkRef = useRef<HTMLInputElement>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const { selectedEpoch, loading, deleteEpoch } = useEpoch()

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleDelete = async () => {
    if (checkRef.current?.checked && selectedEpoch) {
      const deleted = await deleteEpoch(selectedEpoch.index)
      if (deleted) {
        close()
      } else {
        // TODO: show error
      }
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fz="xl" fw={500}>
            Delete admin
          </Text>
        }
        centered
      >
        <Box mx="auto">
          <Stack>
            <Box>
              <Text fw={500}>Index: {selectedEpoch?.index}</Text>
              <Text fz="xs" c="dimmed">
                {selectedEpoch?.startTime ? formatZonedDate(selectedEpoch.startTime) : ''}
                {` ~ `}
                {selectedEpoch?.endTime ? formatZonedDate(selectedEpoch.endTime) : ''}
              </Text>
            </Box>

            <Checkbox
              color="red"
              ref={checkRef}
              label="Confirm to delete this epoch forever"
              mb="lg"
            />

            <Button color="red" onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
})
