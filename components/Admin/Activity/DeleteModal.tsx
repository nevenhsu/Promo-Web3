'use client'

import { useRef } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Checkbox, Text } from '@mantine/core'
import { useActivity } from '@/store/contexts/admin/ActivityContext'
import { formateDate } from '@/utils/helper'

export type DeleteModalRef = {
  open: () => void
}

export default forwardRef<DeleteModalRef, {}>(function AddModal(props, ref) {
  const checkRef = useRef<HTMLInputElement>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const { selectedActivity, loading, deleteActivity } = useActivity()

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleDelete = async () => {
    if (checkRef.current?.checked && selectedActivity) {
      const deleted = await deleteActivity(selectedActivity.index)
      if (deleted) {
        close()
      } else {
        // TODO: show error
      }
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete admin" centered>
        <Box mx="auto">
          <Stack>
            <Box>
              <Text fw={500}>Title: {selectedActivity?.title}</Text>
              <Text fz="xs" c="dimmed">
                Index: {selectedActivity?.index}
              </Text>
              <Text fz="xs" c="dimmed">
                {selectedActivity?.startTime ? formateDate(selectedActivity.startTime) : ''}
                {` ~ `}
                {selectedActivity?.endTime ? formateDate(selectedActivity.endTime) : ''}
              </Text>
            </Box>

            <Checkbox
              color="red"
              ref={checkRef}
              label="Confirm to delete this activity forever"
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
