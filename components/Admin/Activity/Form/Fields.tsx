'use client'

import * as _ from 'lodash-es'
import { useMemo, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { TextInput, Textarea, Select, Switch, Button } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { symbols } from '@/contracts/tokens'
import { useFormContext } from './Context'
import { ActivityType, SocialMedia } from '@/types/db'
import { createSlug } from '../variables'

export default function FormFields() {
  const form = useFormContext()
  const { socialMedia, activityType } = form.values

  const activityTypes = useMemo(() => {
    if (socialMedia === SocialMedia.X) {
      return [{ label: 'Repost', value: `${ActivityType.Repost}` }]
    }
    if (socialMedia === SocialMedia.Instagram) {
      return [{ label: 'Add to story', value: `${ActivityType.Story}` }]
    }
    return []
  }, [socialMedia])

  useEffect(() => {
    if (socialMedia === SocialMedia.X && activityType !== `${ActivityType.Repost}`) {
      form.setFieldValue('activityType', `${ActivityType.Repost}`)
    }
    if (socialMedia === SocialMedia.Instagram && activityType !== `${ActivityType.Story}`) {
      form.setFieldValue('activityType', `${ActivityType.Story}`)
    }
  }, [socialMedia, activityType])

  return (
    <>
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
        key={form.key('title')}
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
        key={form.key('slug')}
        {...form.getInputProps('slug')}
      />

      <Textarea
        label="Description"
        placeholder="Activity description"
        key={form.key('description')}
        {...form.getInputProps('description')}
      />

      <Select
        label="Social Media"
        placeholder="Pick one"
        withCheckIcon={false}
        data={_.map(SocialMedia, (value, label) => ({ value, label }))}
        key={form.key('socialMedia')}
        {...form.getInputProps('socialMedia')}
      />

      <Select
        label="Activity Type"
        placeholder="Pick one"
        withCheckIcon={false}
        data={activityTypes.map(({ value, label }) => ({ value, label }))}
        key={form.key('activityType')}
        {...form.getInputProps('activityType')}
      />

      <Select
        label="Airdrop Token"
        placeholder="Pick one"
        withCheckIcon={false}
        data={symbols.map(o => ({ value: o, label: o }))}
        key={form.key('airdrop.symbol')}
        {...form.getInputProps('airdrop.symbol')}
      />

      <TextInput
        label="Airdrop Amount"
        placeholder="0"
        key={form.key('airdrop.amount')}
        {...form.getInputProps('airdrop.amount')}
      />

      <TextInput
        label="Link"
        placeholder="Post ID"
        key={form.key('details.link')}
        {...form.getInputProps('details.link')}
      />

      <Switch
        label="Published"
        key={form.key('published')}
        {...form.getInputProps('published', { type: 'checkbox' })}
      />
    </>
  )
}
