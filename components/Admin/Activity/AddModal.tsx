'use client'

import * as _ from 'lodash-es'
import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useActivity } from '@/store/contexts/admin/ActivityContext'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Text } from '@mantine/core'
import Form, { type FormRef } from './Form'
import FormFields from './Form/Fields'
import { publicEnv } from '@/utils/env'
import type { ActivityData } from '@/models/activity'

export type AddModalRef = {
  open: () => void
}

export default forwardRef<AddModalRef, {}>(function AddModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)
  const { createActivity, loading } = useActivity()

  const formRef = useRef<FormRef>(null)

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleClose = () => {
    formRef.current?.getForm()?.reset()
    close()
  }

  const handleSubmit = async (data: ActivityData) => {
    const newActivity = await createActivity(data)
    if (newActivity) {
      handleClose()
    } else {
      // TODO: show error
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={
          <Text fz="xl" fw={500}>
            Add new activity
          </Text>
        }
        centered
        keepMounted
      >
        <Box mx="auto">
          <Form ref={formRef}>
            <form
              onSubmit={formRef.current?.getForm().onSubmit(
                values => {
                  const { chainId, startTime, endTime, activityType, ...rest } = values
                  if (startTime && endTime) {
                    handleSubmit({
                      ...rest,
                      startTime,
                      endTime,
                      chainId: Number(chainId),
                      activityType: Number(activityType),
                    })
                  }
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
                <Text fz={14} mb="md">
                  Timezone: {publicEnv.timezone}
                </Text>

                <FormFields />

                <Box mb="md" />

                <Button type="submit" loading={loading}>
                  Submit
                </Button>
              </Stack>
            </form>
          </Form>
        </Box>
      </Modal>
    </>
  )
})
