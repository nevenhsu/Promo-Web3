'use client'

import { useRef } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Checkbox, Text } from '@mantine/core'

export type DeleteModalRef = {
  open: () => void
}

type DeleteModalProps = {
  username?: string
  name?: string
}

export default forwardRef<DeleteModalRef, DeleteModalProps>(function AddModal(props, ref) {
  const { name, username } = props

  const checkRef = useRef<HTMLInputElement>(null)

  const [opened, { open, close }] = useDisclosure(false)

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete admin" centered>
        <Box mx="auto">
          <Stack>
            <Text fw={500}>{name}</Text>

            <Checkbox
              color="red"
              ref={checkRef}
              label="Confirm to delete this admin forever"
              mb="sm"
            />

            <Button color="red">Delete</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
})
