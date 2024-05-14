'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Text, Button, Select, Switch } from '@mantine/core'
import { labelData } from './variables'

export type UpdateModalRef = {
  open: () => void
}

type UpdateModalProps = {
  username?: string
  name?: string
  active?: boolean
}

export default forwardRef<UpdateModalRef, UpdateModalProps>(function UpdateModal(props, ref) {
  const { username, name, active } = props
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      role: '1',
      active,
    },
  })

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update admin" centered>
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
              <Text fw={500}>{name}</Text>

              <Select
                data={labelData}
                label="Role"
                key={form.key('role')}
                {...form.getInputProps('role')}
              />

              <Switch
                label="Active"
                key={form.key('active')}
                {...form.getInputProps('active')}
                my="xs"
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
