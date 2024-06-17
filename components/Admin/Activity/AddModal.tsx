'use client'

import * as _ from 'lodash-es'
import { isBefore } from 'date-fns'
import { forwardRef, useImperativeHandle } from 'react'
import { useActivity } from '@/store/contexts/ActivityContext'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Button, Text } from '@mantine/core'
import { TextInput, Textarea, NumberInput, Select } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { formateDate } from '@/utils/helper'
import { publicEnv } from '@/utils/env'
import { ActivityType, SocialMedia } from '@/types/db'
import { activityTypes } from './variables'
import type { Activity } from '@/models/activity'

export type AddModalRef = {
  open: () => void
}

export default forwardRef<AddModalRef, {}>(function AddModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)
  const { createActivity, loading } = useActivity()

  const form = useForm<{
    title: string
    startTime: null | Date
    endTime: null | Date
    description: string
    points: number
    activityType: string
    socialMedia: SocialMedia
    link: string
    coverUrl: string
    thumbnailUrl: string
  }>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      startTime: null,
      endTime: null,
      description: '',
      points: 0,
      activityType: `${ActivityType.None}`,
      socialMedia: SocialMedia.X,
      link: '',
      coverUrl: '',
      thumbnailUrl: '',
    },
    validate: {
      startTime: (value, values) => {
        if (!value) {
          return 'Should not be empty'
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
      title: value => (value ? null : 'Should not be empty'),
      activityType: value => (value ? null : 'Should not be empty'),
      socialMedia: value => (value ? null : 'Should not be empty'),
      points: value => (value >= 0 ? null : 'Should be greater than or equal to 0'),
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

  const handleSubmit = async (data: Omit<Activity, 'index'>) => {
    const newActivity = await createActivity(data)
    if (newActivity) {
      handleClose()
    } else {
      // TODO: show error
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title="Add new activity" centered>
        <Box mx="auto">
          <form
            onSubmit={form.onSubmit(
              values => {
                const { link, coverUrl, thumbnailUrl, ...rest } = values
                const { startTime, endTime, activityType } = rest
                if (startTime && endTime) {
                  handleSubmit({
                    ...rest,
                    startTime,
                    endTime,
                    activityType: Number(activityType),
                    details: { link, coverUrl, thumbnailUrl },
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

              <DateTimePicker
                valueFormat="DD MMM YYYY hh:mm A"
                label="Start Time"
                key={form.key('startTime')}
                {...form.getInputProps('startTime')}
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

              <TextInput
                label="Title"
                placeholder="Activity title"
                {...form.getInputProps('title')}
              />

              <Textarea
                label="Description"
                placeholder="Activity description"
                {...form.getInputProps('description')}
              />

              <NumberInput
                label="Points"
                placeholder="0"
                min={0}
                {...form.getInputProps('points')}
              />

              <Select
                label="Activity Type"
                placeholder="Pick one"
                withCheckIcon={false}
                data={_.map(activityTypes, ({ value, label }) => ({ value: `${value}`, label }))}
                {...form.getInputProps('activityType')}
              />
              <Select
                label="Social Media"
                placeholder="Pick one"
                withCheckIcon={false}
                data={_.map(SocialMedia, (value, label) => ({ value, label }))}
                {...form.getInputProps('socialMedia')}
              />

              <TextInput label="Link" placeholder="Activity link" {...form.getInputProps('link')} />

              <TextInput
                label="Cover URL"
                placeholder="Cover image URL"
                {...form.getInputProps('coverUrl')}
              />

              <TextInput
                label="Thumbnail URL"
                placeholder="Thumbnail image URL"
                {...form.getInputProps('thumbnailUrl')}
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
