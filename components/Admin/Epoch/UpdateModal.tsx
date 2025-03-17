'use client'

import * as _ from 'lodash-es'
import { isBefore, isAfter } from 'date-fns'
import { forwardRef, useImperativeHandle, useEffect } from 'react'
import { useEpoch } from '@/store/contexts/admin/EpochContext'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Text, Button } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { formatZonedDate, getStartOfDate } from '@/utils/helper'
import { publicEnv } from '@/utils/env'

export type UpdateModalRef = {
  open: () => void
}

export default forwardRef<UpdateModalRef, {}>(function UpdateModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)
  const { updateEpoch, epochs, selectedIndex, selectedEpoch, loading } = useEpoch()

  const prevEpoch = selectedIndex ? _.find(epochs, { index: selectedIndex - 1 }) : undefined
  const nextEpoch = _.isNumber(selectedIndex)
    ? _.find(epochs, { index: selectedIndex + 1 })
    : undefined

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
        if (prevEpoch && isBefore(value, new Date(prevEpoch.endTime))) {
          return `Should not before ${formatZonedDate(prevEpoch.endTime, 'MMM dd yyyy h:mm aa')}`
        }
        if (values.endTime && !isBefore(value, values.endTime)) {
          return `Should before ${formatZonedDate(values.endTime, 'MMM dd yyyy h:mm aa')}`
        }
        return null
      },
      endTime: (value, values) => {
        if (!value) {
          return 'Should not be empty'
        }
        if (nextEpoch && isAfter(value, new Date(nextEpoch.startTime))) {
          return `Should not after ${formatZonedDate(nextEpoch.startTime, 'MMM dd yyyy h:mm aa')}`
        }
        if (values.startTime && isBefore(value, values.startTime)) {
          return `Should after ${formatZonedDate(values.startTime, 'MMM dd yyyy h:mm aa')}`
        }
        return null
      },
    },
  })

  useEffect(() => {
    if (opened && selectedEpoch) {
      form.setValues({
        startTime: new Date(selectedEpoch.startTime),
        endTime: new Date(selectedEpoch.endTime),
      })
    }
  }, [selectedEpoch, opened])

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleSubmit = async (startTime: Date, endTime: Date) => {
    if (selectedEpoch) {
      const updated = await updateEpoch(selectedEpoch.index, { startTime, endTime })
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
            Update admin
          </Text>
        }
        centered
      >
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
                  const { endTime } = form.getValues()
                  const d = getStartOfDate(date)
                  if (endTime && prevEpoch) {
                    return isBefore(endTime, d) || isBefore(d, getStartOfDate(prevEpoch.endTime))
                  }
                  if (endTime) {
                    return isBefore(endTime, d)
                  }
                  return false
                }}
              />

              <DateTimePicker
                valueFormat="DD MMM YYYY hh:mm A"
                label="End Time"
                key={form.key('endTime')}
                {...form.getInputProps('endTime')}
                excludeDate={date => {
                  const { startTime } = form.getValues()
                  const d = getStartOfDate(date)
                  if (startTime && nextEpoch) {
                    return (
                      isBefore(d, startTime) || isBefore(getStartOfDate(nextEpoch.startTime), d)
                    )
                  }
                  if (startTime) {
                    return isBefore(d, startTime)
                  }
                  return false
                }}
              />

              <Box mb="md" />

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
