'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useForm, hasLength } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, TextInput, Button, Select } from '@mantine/core'
import { useAdmin } from '@/store/contexts/admin/AdminContext'
import { labelData } from './variables'

export type AddModalRef = {
  open: () => void
}

export default forwardRef<AddModalRef, {}>(function AddModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)
  const { createAdmin, loading } = useAdmin()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      role: '1',
    },
    validate: {
      username: hasLength({ min: 1 }, 'Username should not be empty'),
      role: hasLength({ min: 1 }, 'Role should not be empty'),
    },
  })

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleClose = () => {
    form.reset()
    close()
  }

  const handleSubmit = async (username: string, role: number) => {
    const newAdmin = await createAdmin(username, role)

    if (newAdmin) {
      handleClose()
    } else {
      form.setFieldError('username', 'Wrong username')
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title="Add new admin" centered>
        <Box mx="auto">
          <form
            onSubmit={form.onSubmit(
              values => {
                handleSubmit(values.username, parseInt(values.role))
              },
              (validationErrors, values, event) => {
                console.log(
                  validationErrors, // <- form.errors at the moment of submit
                  values, // <- form.getValues() at the moment of submit
                  event // <- form element submit event
                )
              }
            )}
          >
            <Stack>
              <TextInput
                data-autofocus
                label="Username"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />

              <Select
                data={labelData}
                label="Role"
                key={form.key('role')}
                {...form.getInputProps('role')}
              />

              <span />

              <Button type="submit" loading={loading}>
                Submit
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  )
})
