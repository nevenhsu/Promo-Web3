'use client'

import { useRef } from 'react'
import { useAsyncFn } from 'react-use'
import { useDisclosure } from '@mantine/hooks'
import { Title, Stack, Space } from '@mantine/core'
import { Text, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Form, { type FormRef } from '../Form'
import UpdateFields from '../Form/UpdateFields'
import type { ActivityData } from '@/types/activitySetting'

export default function UpdateActivity({ slug }: { slug: string }) {
  const formRef = useRef<FormRef>(null)

  const [opened, { open, close }] = useDisclosure(false)
  const [updateActivityState, updateActivity] = useAsyncFn(async (data: ActivityData) => {}, [])
  const { loading, value, error } = updateActivityState

  const handleSubmit = async (data: ActivityData) => {
    console.log(data)
    open()
  }

  // TODO: set data to form

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

          <Form ref={formRef}>
            <form
              onSubmit={formRef.current?.getForm().onSubmit(
                values => {
                  const { title, description, details, setting, published } = values
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
                <UpdateFields activity={{} as any} />

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
