'use client'

import { forwardRef, useImperativeHandle, useEffect } from 'react'
import { useForm, hasLength } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Text, Button, Select, Switch } from '@mantine/core'
import { useAdmin } from '@/store/contexts/admin/AdminContext'
import { labelData } from './variables'

export type UpdateModalRef = {
  open: () => void
}

export default forwardRef<UpdateModalRef, {}>(function UpdateModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      role: '1',
      active: true,
    },
    validate: {
      role: hasLength({ min: 1 }, 'Role should not be empty'),
    },
  })

  const { selectedAdmin, admins, loading, updateAdmin } = useAdmin()

  useEffect(() => {
    if (opened && selectedAdmin) {
      form.setValues({
        role: `${selectedAdmin.role}`,
        active: selectedAdmin.active,
      })
    }
  }, [selectedAdmin, opened])

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleSubmit = async (role: number, active: boolean) => {
    if (selectedAdmin?._user._id) {
      const updated = await updateAdmin(selectedAdmin._user._id, { role, active })
      if (updated) {
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
            Update admin
          </Text>
        }
        centered
      >
        <Box mx="auto">
          <form
            onSubmit={form.onSubmit(
              values => {
                handleSubmit(parseInt(values.role), values.active)
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
              <Box>
                <Text fw={500}>{selectedAdmin?._user.name}</Text>
                <Text fz="xs" c="dimmed">
                  {selectedAdmin?._user.username ? `@${selectedAdmin?._user.username}` : '-'}
                </Text>
              </Box>

              <Select
                data={labelData}
                label="Role"
                key={form.key('role')}
                {...form.getInputProps('role')}
              />

              <Switch
                label="Active"
                key={form.key('active')}
                {...form.getInputProps('active', { type: 'checkbox' })}
                my="xs"
              />

              <span />

              <Button type="submit" loading={loading}>
                Update
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  )
})
