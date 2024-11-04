'use client'

import * as _ from 'lodash-es'
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useActivity } from '@/store/contexts/admin/ActivityContext'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Text, Button } from '@mantine/core'
import Form, { type FormRef } from './Form'
import FormFields from './Form/Fields'
import { publicEnv } from '@/utils/env'
import { ActivitySettingType } from '@/types/db'
import type { ActivityData } from '@/models/activity'

export type UpdateModalRef = {
  open: () => void
}

export default forwardRef<UpdateModalRef, {}>(function UpdateModal(props, ref) {
  const formRef = useRef<FormRef>(null)

  const [opened, { open, close }] = useDisclosure(false)
  const { updateActivity, selectedActivity, loading } = useActivity()

  useEffect(() => {
    const form = formRef.current?.getForm()

    if (opened && selectedActivity && form) {
      const { chainId, startTime, endTime, activityType, setting, ...rest } = selectedActivity
      form.setValues({
        chainId: `${chainId}`,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        activityType: `${activityType}`,
        setting: {
          type: setting?.type || ActivitySettingType.None,
          data: setting?.data || { minFollowers: 100 },
        },
        ...rest,
      })
    } else {
      form?.reset()
    }
  }, [selectedActivity, opened])

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleSubmit = async (data: Partial<ActivityData>) => {
    if (selectedActivity) {
      const updated = await updateActivity(selectedActivity._id, data)
      if (updated) {
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
            Update activity
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
                  const { chainId, startTime, endTime, activityType } = values
                  if (startTime && endTime) {
                    handleSubmit({
                      ...values,
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
                  Update
                </Button>
              </Stack>
            </form>
          </Form>
        </Box>
      </Modal>
    </>
  )
})
