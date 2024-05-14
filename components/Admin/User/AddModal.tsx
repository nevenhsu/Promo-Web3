'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useForm, hasLength } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, TextInput, Button, Select } from '@mantine/core'
import { labelData } from './variables'

export type AddModalRef = {
  open: () => void
}

export default forwardRef<AddModalRef, {}>(function AddModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      role: '1',
    },
    validate: {
      username: hasLength({ min: 1 }, 'Username should not be empty'),
    },
  })

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add new admin" centered>
        <Box mx="auto">
          <form
            onSubmit={form.onSubmit(
              values => {
                console.log(values)
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

              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  )
})
