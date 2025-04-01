'use client'

import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { Title, Stack, Space } from '@mantine/core'
import { Text, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Form, { type FormType } from '../Form'
import UpdateFields from '../Form/UpdateFields'
import { getCreatorActivityData } from '@/services/activity'
import type { ActivityData } from '@/types/activitySetting'

export default function UpdateActivity({ slug }: { slug: string }) {
  // state
  const [form, setForm] = useState<FormType>()

  const [activityState, fetchActivity] = useAsyncFn(async () => {
    return getCreatorActivityData(slug)
  }, [slug])
  const { value } = activityState

  const [updateActivityState, updateActivity] = useAsyncFn(async (data: ActivityData) => {}, [])
  const { error } = updateActivityState

  const loading = !value || activityState.loading || updateActivityState.loading

  const handleSubmit = async (data: ActivityData) => {
    console.log(data)
  }

  // TODO: set data to form
  useEffect(() => {
    if (form && value) {
      form.setFieldValue('title', value.title || '')
      form.setFieldValue('description', value.description || '')
      form.setFieldValue('details.externalLink', value.details.externalLink || '')
      form.setFieldValue('setting.data.maxTotalScore', value.setting.data.maxTotalScore || 0)
      form.setFieldValue('setting.data.minFollowers', value.setting.data.minFollowers || 0)
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
                }
              )}
            >
              <Stack gap="lg">
                <UpdateFields activity={value} />

                <span />

                <Button type="submit" loading={loading}>
                  Submit
                </Button>
              </Stack>
            </form>
          </Form>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
