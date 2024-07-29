'use client'

import * as _ from 'lodash-es'
import { isBefore } from 'date-fns'
import { forwardRef, useImperativeHandle, useEffect } from 'react'
import { useActivity } from '@/store/contexts/admin/ActivityContext'
import { useWeb3 } from '@/wallet/Web3Context'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Stack, Box, Text, Button } from '@mantine/core'
import { TextInput, Textarea, Select, Switch } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { formateDate } from '@/utils/helper'
import { publicEnv } from '@/utils/env'
import { ActivityType, SocialMedia } from '@/types/db'
import { activityTypes, createSlug } from './variables'
import type { Activity, ActivityDetail, ActivityAirDrop } from '@/models/activity'

export type UpdateModalRef = {
  open: () => void
}

export default forwardRef<UpdateModalRef, {}>(function UpdateModal(props, ref) {
  const [opened, { open, close }] = useDisclosure(false)
  const { updateActivity, selectedIndex, selectedActivity, loading } = useActivity()
  const { tokens } = useWeb3()

  const form = useForm<{
    title: string
    slug: string
    startTime: null | Date
    endTime: null | Date
    description: string
    token: string
    amount: string // Base unit, not wei, ex: 10 USDC
    activityType: string
    socialMedia: string
    link: string
    coverUrl: string
    thumbnailUrl: string
    published: boolean
  }>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      slug: '',
      startTime: null,
      endTime: null,
      description: '',
      token: tokens[0]?.symbol || '',
      amount: '0',
      activityType: `${ActivityType.Repost}`,
      socialMedia: SocialMedia.X,
      link: '',
      coverUrl: '',
      thumbnailUrl: '',
      published: false,
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
      slug: value => (value ? null : 'Should not be empty'),
      activityType: value => (value ? null : 'Should not be empty'),
      socialMedia: value => (value ? null : 'Should not be empty'),
      token: value => (value ? null : 'Should not be empty'),
      amount: value => (Number(value) >= 0 ? null : 'Should be greater than or equal to 0'),
    },
  })

  useEffect(() => {
    if (opened && selectedActivity) {
      form.setValues({
        startTime: new Date(selectedActivity.startTime || Date.now()),
        endTime: new Date(selectedActivity.endTime || Date.now()),
        title: selectedActivity.title,
        slug: selectedActivity.slug,
        description: selectedActivity.description,
        token: selectedActivity.airdrop.symbol,
        amount: selectedActivity.airdrop.amount,
        activityType: `${selectedActivity.activityType}`,
        socialMedia: selectedActivity.socialMedia,
        link: selectedActivity.details.link || '',
        coverUrl: selectedActivity.details.coverUrl || '',
        thumbnailUrl: selectedActivity.details.thumbnailUrl || '',
        published: selectedActivity.published,
      })
    }
  }, [selectedActivity, opened])

  useImperativeHandle(ref, () => ({
    open() {
      open()
    },
  }))

  const handleSubmit = async (
    data: Omit<Activity, 'index' | 'details' | 'airdrop' | 'requirements'>,
    details: Partial<ActivityDetail>,
    airdrop: Partial<ActivityAirDrop>
  ) => {
    if (selectedActivity) {
      const updated = await updateActivity(selectedActivity.index, data, details, airdrop)
      if (updated) {
        close()
      } else {
        // TODO: show error
      }
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update admin" centered>
        <Box mx="auto">
          <form
            onSubmit={form.onSubmit(
              values => {
                const { link, coverUrl, thumbnailUrl, amount, token, ...rest } = values
                const { startTime, endTime, activityType } = rest
                const tokenData = tokens.find(({ symbol }) => symbol === values.token)
                if (startTime && endTime && tokenData) {
                  handleSubmit(
                    {
                      ...rest,
                      startTime,
                      endTime,
                      activityType: Number(activityType),
                    },
                    { link, coverUrl, thumbnailUrl },
                    {
                      symbol: tokenData.symbol,
                      amount,
                    }
                  )
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
                {...form.getInputProps('startTime')}
              />

              <DateTimePicker
                valueFormat="DD MMM YYYY hh:mm A"
                label="End Time"
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

              <TextInput
                label="Slug"
                placeholder="Activity URL slug"
                rightSectionWidth={60}
                rightSection={
                  <Button
                    variant="transparent"
                    size="compact-xs"
                    onClick={() => {
                      form.setFieldValue('slug', createSlug(form.getValues().title))
                    }}
                  >
                    Create
                  </Button>
                }
                {...form.getInputProps('slug')}
              />

              <Textarea
                label="Description"
                placeholder="Activity description"
                {...form.getInputProps('description')}
              />

              <Select
                label="Airdrop Token"
                placeholder="Pick one"
                withCheckIcon={false}
                data={_.map(tokens, ({ symbol }) => ({ value: symbol, label: symbol }))}
                {...form.getInputProps('token')}
              />

              <TextInput label="Airdrop Amount" placeholder="0" {...form.getInputProps('amount')} />

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

              <TextInput label="Link" placeholder="Post ID" {...form.getInputProps('link')} />

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

              <Switch
                label="Published"
                {...form.getInputProps('published', { type: 'checkbox' })}
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
