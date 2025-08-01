'use client'

import { addDays } from 'date-fns'
import { notifications } from '@mantine/notifications'
import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { Title, Stack, Space, Text, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Form, { type FormType } from '../Form'
import UpdateFields from '../Form/UpdateFields'
import { getCreatorActivityData, updateCreatorActivity } from '@/services/activity'
import type { ActivityData } from '@/types/activitySetting'

export default function UpdateActivity({ slug }: { slug: string }) {
  // state
  const [form, setForm] = useState<FormType>()
  const [formError, setFormError] = useState<string>('')

  const [activityState, fetchActivity] = useAsyncFn(async () => {
    return getCreatorActivityData(slug)
  }, [slug])
  const { value } = activityState

  const [updateActivityState, updateActivity] = useAsyncFn(async (data: ActivityData) => {
    return updateCreatorActivity(slug, data)
  }, [])
  const { value: newValue } = updateActivityState

  const loading = !value || activityState.loading || updateActivityState.loading

  const handleSubmit = async (data: ActivityData) => {
    const result = await updateActivity(data)

    if (result) {
      notifications.show({
        title: 'Activity updated',
        message: 'Your activity has been updated successfully',
        color: 'green',
      })
      setFormError('')
    } else {
      setFormError('Failed to update activity')
    }
  }

  useEffect(() => {
    if (form && value) {
      form.setFieldValue('title', value.title || '')
      form.setFieldValue('description', value.description || '')
      form.setFieldValue('details.externalLink', value.details.externalLink || '')
      form.setFieldValue('setting.data.maxTotalScore', value.setting.data.maxTotalScore || 0)
      form.setFieldValue('setting.data.minFollowers', value.setting.data.minFollowers || 0)

      // set other fields as needed
      form.setFieldValue('airdrop.amount', value.airdrop?.amount || '0')
      form.setFieldValue('airdrop.symbol', value.airdrop?.symbol || '')
      form.setFieldValue('details.fullLink', value.details.fullLink || '')
      form.setFieldValue('details.link', value.details.link || '')
      form.setFieldValue('endTime', addDays(new Date(), 7))
      form.setFieldValue('startTime', value.startTime ? new Date(value.startTime) : null)
    }
  }, [form, value])

  useEffect(() => {
    if (slug) {
      fetchActivity()
    }
  }, [slug])

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Stack gap="xs">
            <Title order={3}>Update Activity</Title>
            <Text fz="sm" c="dimmed">
              Fill the fields below to publish your activity
            </Text>
          </Stack>

          <Form onReady={setForm}>
            <form
              onSubmit={form?.onSubmit(
                values => {
                  handleSubmit(values)
                },
                (validationErrors, values, event) => {
                  console.log(
                    validationErrors, // <- form.errors at the moment of submit
                    values, // <- form.getValues() at the moment of submit
                    event // <- form element submit event
                  )
                  setFormError('Please fill all required fields')
                }
              )}
            >
              <Stack gap="lg">
                <UpdateFields activity={value} />

                <span />

                <Button type="submit" loading={loading}>
                  {!formError && newValue ? 'Updated' : 'Update'}
                </Button>

                <Text c="red" fz="xs" ta="center">
                  {formError}
                </Text>
              </Stack>
            </form>
          </Form>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
