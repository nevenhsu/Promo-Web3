'use client'

import * as _ from 'lodash-es'
import { useMemo, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { TextInput, NumberInput, Textarea, Select, Switch, Button, Space } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { symbols } from '@/contracts/tokens'
import { useFormContext } from './Context'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'
import { createSlug } from '../variables'
import { isTypeA } from '@/types/activitySetting'

export default function FormFields() {
  const form = useFormContext()
  const { socialMedia, activityType, setting, airdrop } = form.values
  const settingType = setting.type
  const airdropAmount = Number(airdrop.amount)

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
        allowDeselect={false}
        data={_.map(SocialMedia, (value, label) => ({ value, label }))}
        key={form.key('socialMedia')}
        {...form.getInputProps('socialMedia')}
      />

      <Select
        label="Activity Type"
        placeholder="Pick one"
        withCheckIcon={false}
        allowDeselect={false}
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
        key={form.key('airdrop.amount')}
        {...form.getInputProps('airdrop.amount')}
      />

      <TextInput
        label="Post Id"
        placeholder="123456789"
        key={form.key('details.link')}
        {...form.getInputProps('details.link')}
      />

      <TextInput
        label="Full Link"
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

      <Select
        label="Setting Type"
        withCheckIcon={false}
        allowDeselect={false}
        data={_.map(ActivitySettingType, (value, label) => ({ label, value }))}
        key={form.key('setting.type')}
        {...form.getInputProps('setting.type')}
      />

      {settingType === ActivitySettingType.A ? (
        <>
          <NumberInput
            label="Max Total Score"
            description={
              isTypeA(setting) && airdropAmount
                ? `Airdrop 1 : ${setting.data.maxTotalScore / airdropAmount}`
                : ''
            }
            min={0}
            key={form.key('setting.data.maxTotalScore')}
            {...form.getInputProps('setting.data.maxTotalScore')}
          />

          <NumberInput
            label="Max Self Score"
            min={0}
            key={form.key('setting.data.maxSelfScore')}
            {...form.getInputProps('setting.data.maxSelfScore')}
          />
        </>
      ) : null}

      <Space />

      <Switch
        label="Published"
        key={form.key('published')}
        {...form.getInputProps('published', { type: 'checkbox' })}
      />
    </>
  )
}
