'use client'

import { useRef } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Checkbox, Text } from '@mantine/core'
import { useAdmin } from '@/store/contexts/admin/AdminContext'

export type DeleteModalRef = {
  open: () => void
}

export default forwardRef<DeleteModalRef, {}>(function AddModal(props, ref) {
  const checkRef = useRef<HTMLInputElement>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const { selectedAdmin, loading, deleteAdmin } = useAdmin()

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleDelete = async () => {
    if (checkRef.current?.checked && selectedAdmin?._user._id) {
      const deleted = await deleteAdmin(selectedAdmin._user._id)
      if (deleted) {
        close()
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
              <Text fw={500}>{selectedAdmin?._user.name}</Text>
              <Text fz="xs" c="dimmed">
                {selectedAdmin?._user.username ? `@${selectedAdmin?._user.username}` : '-'}
              </Text>
            </Box>

            <Checkbox
              color="red"
              ref={checkRef}
              label="Confirm to delete this admin forever"
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
