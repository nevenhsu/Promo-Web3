'use client'

import { isBefore } from 'date-fns'
import { forwardRef, useImperativeHandle } from 'react'
import { useEpoch } from '@/store/contexts/EpochContext'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { formateDate, getStartOfDate } from '@/utils/helper'
import { publicEnv } from '@/utils/env'

export type AddModalRef = {
  open: () => void
}

export default forwardRef<AddModalRef, {}>(function AddModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)
  const { createEpoch, epochs, loading } = useEpoch()

  const lastDate = epochs[0]?.endTime ? new Date(epochs[0].endTime) : undefined

  const form = useForm<{
    startTime: null | Date
    endTime: null | Date
  }>({
    mode: 'uncontrolled',
    initialValues: {
      startTime: null,
      endTime: null,
    },
    validate: {
      startTime: (value, values) => {
        if (!value) {
          return 'Should not be empty'
        }
        if (lastDate && isBefore(value, lastDate)) {
          return `Should after ${formateDate(lastDate, 'MMM dd yyyy h:mm aa')}`
        }
        if (values.endTime && !isBefore(value, values.endTime)) {
          return `Should before ${formateDate(values.endTime, 'MMM dd yyyy h:mm aa')}`
        }
        return null
      },
      endTime: (value, values) => {
        if (!value) {
          return 'Should not be empty'
        }
        if (values.startTime && isBefore(value, values.startTime)) {
          return `Should after ${formateDate(values.startTime, 'MMM dd yyyy h:mm aa')}`
        }
        return null
      },
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

  const handleSubmit = async (startTime: Date, endTime: Date) => {
    const newEpoch = await createEpoch(startTime, endTime)
    if (newEpoch) {
      handleClose()
    } else {
      // TODO: show error
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title="Add new epoch" centered>
        <Box mx="auto">
          <form
            onSubmit={form.onSubmit(
              values => {
                if (values.startTime && values.endTime) {
                  handleSubmit(values.startTime, values.endTime)
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

              <DateTimePicker
                valueFormat="DD MMM YYYY hh:mm A"
                label="Start Time"
                key={form.key('startTime')}
                {...form.getInputProps('startTime')}
                excludeDate={date => {
                  const d = getStartOfDate(date)
                  return Boolean(lastDate && isBefore(d, getStartOfDate(lastDate)))
                }}
              />

              <DateTimePicker
                valueFormat="DD MMM YYYY hh:mm A"
                label="End Time"
                key={form.key('endTime')}
                {...form.getInputProps('endTime')}
                excludeDate={date =>
                  Boolean(form.getValues().startTime && isBefore(date, form.getValues().startTime!))
                }
              />

              <Box mb="md" />

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
