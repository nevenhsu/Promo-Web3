'use client'

import * as _ from 'lodash-es'
import { useMemo, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { Paper, TextInput, Select, Stack, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { symbols } from '@/contracts/tokens'
import { useFormContext } from './Context'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'

export default function FormFields() {
  const form = useFormContext()
  const { socialMedia, activityType, setting } = form.values
  const settingType = setting.type

  const activityTypes = useMemo(() => {
    if (socialMedia === SocialMedia.X) {
      return [{ label: 'Repost', value: `${ActivityType.Repost}` }]
    }
    if (socialMedia === SocialMedia.Instagram) {
      return [{ label: 'Add to story', value: `${ActivityType.Story}` }]
    }
    return []
  }, [socialMedia])

  // Set default activity type based on social media
  useEffect(() => {
    if (socialMedia === SocialMedia.X && activityType !== `${ActivityType.Repost}`) {
      form.setFieldValue('activityType', `${ActivityType.Repost}`)
    }
    if (socialMedia === SocialMedia.Instagram && activityType !== `${ActivityType.Story}`) {
      form.setFieldValue('activityType', `${ActivityType.Story}`)
    }
  }, [socialMedia, activityType])

  useEffect(() => {
    if (settingType === ActivitySettingType.None) {
      form.setFieldValue('setting.data', {})
    }
    if (settingType === ActivitySettingType.A) {
      const amount = Number(form.values.airdrop.amount)
      form.setFieldValue('setting.data', {
        maxTotalScore: amount ? amount * 1000 : 0,
        maxSelfScore: 10000,
      })
    }
  }, [settingType])

  return (
    <>
      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Text fw={500}>What is the date of activity?</Text>
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
        </Stack>
      </Paper>

      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Text fw={500}>What is the post to be shared?</Text>
          <Select
            label="Social Media"
            placeholder="Pick one"
            withCheckIcon={false}
            allowDeselect={false}
            data={_.map(SocialMedia, (value, label) => ({ value, label }))}
            key={form.key('socialMedia')}
            {...form.getInputProps('socialMedia')}
          />

          <Select
            placeholder="Pick one"
            withCheckIcon={false}
            allowDeselect={false}
            data={activityTypes.map(({ value, label }) => ({ value, label }))}
            key={form.key('activityType')}
            {...form.getInputProps('activityType')}
          />

          <TextInput
            label="Post Link"
            placeholder={
              socialMedia === SocialMedia.X
                ? 'https://x.com/user/status/post_id'
                : socialMedia === SocialMedia.Instagram
                  ? 'https://www.instagram.com/p/post_id'
                  : ''
            }
            key={form.key('details.fullLink')}
            {...form.getInputProps('details.fullLink')}
          />
        </Stack>
      </Paper>

      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Text fw={500}>What is the prize for supporters?</Text>
          <Select
            label="Token"
            placeholder="Pick one"
            withCheckIcon={false}
            data={symbols.map(o => ({ value: o, label: o }))}
            key={form.key('airdrop.symbol')}
            {...form.getInputProps('airdrop.symbol')}
          />

          <TextInput
            label="Prize"
            key={form.key('airdrop.amount')}
            {...form.getInputProps('airdrop.amount')}
          />
        </Stack>
      </Paper>
    </>
  )
}
