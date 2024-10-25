'use client'

import { useRef, useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { Link } from '@/i18n/routing'
import { Stack, Space, Paper, Group, ActionIcon, Progress } from '@mantine/core'
import { Title, Text, Button, Box, Divider } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Form, { type FormRef } from '../Form'
import CreateFields from '../Form/CreateFields'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { PiCoinVertical, PiCaretRight } from 'react-icons/pi'
import { isTypeA } from '@/types/activitySetting'
import type { TPublicActivity } from '@/models/activity'
import type { ActivityData } from '@/models/activity'

export default function ProfileActivityNew() {
  const formRef = useRef<FormRef>(null)

  const [progress, setProgress] = useState(25)

  const [createActivityState, createActivity] = useAsyncFn(async (data: ActivityData) => {}, [])

  const handleSubmit = async (data: ActivityData) => {
    console.log(data)
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Stack gap="xs">
            <Title order={3}>New Activity</Title>
            <Text fz="sm" c="dimmed">
              Create an activity to engage with your audience
            </Text>

            <Progress size="xs" value={progress} />
          </Stack>

          <Form ref={formRef}>
            <form
              onSubmit={formRef.current?.getForm().onSubmit(
                values => {
                  const { startTime, endTime, activityType, ...rest } = values
                  if (startTime && endTime) {
                    handleSubmit({
                      ...rest,
                      startTime,
                      endTime,
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
              <Stack gap="lg">
                <CreateFields />

                <Button type="submit" loading={createActivityState.loading}>
                  Next
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
