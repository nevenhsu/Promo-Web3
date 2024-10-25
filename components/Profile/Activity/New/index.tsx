'use client'

import { useRef, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useDisclosure } from '@mantine/hooks'
import { Stack, Space, Group, Modal, Loader } from '@mantine/core'
import { Title, Text, Button, Checkbox } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import ActivityItem from '@/components/share/ActivityItem'
import Form, { type FormRef } from '../Form'
import CreateFields from '../Form/CreateFields'
import { formatDate } from '@/utils/date'
import type { ActivityData } from '@/models/activity'

export default function ProfileActivityNew() {
  const formRef = useRef<FormRef>(null)

  const [opened, { open, close }] = useDisclosure(false)
  const [checked, setChecked] = useState(false)

  const [createActivityState, createActivity] = useAsyncFn(async (data: ActivityData) => {}, [])
  const { loading, value, error } = createActivityState
  const submitted = Boolean(value)

  const handleSubmit = async (data: ActivityData) => {
    console.log(data)
    open()
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          {submitted ? (
            <>
              <Stack gap="xs">
                <Title order={3}>{loading ? 'Creating activity' : 'Congrats!'}</Title>
                <Text fz="sm" c="dimmed">
                  {loading
                    ? 'Please wait for the transaction to be confirmed'
                    : 'Your activity has been created successfully'}
                </Text>
              </Stack>

              <Space h={40} />

              <Stack align="center">
                {loading ? (
                  <>
                    <Loader size="xl" />
                    <Text fz="xs" c="orange">
                      Do not close this page
                    </Text>
                  </>
                ) : (
                  <>
                    <Button>Go to edit details</Button>
                  </>
                )}
              </Stack>
            </>
          ) : (
            <>
              <Stack gap="xs">
                <Title order={3}>New Activity</Title>
                <Text fz="sm" c="dimmed">
                  Create an activity to engage with your audience
                </Text>
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

                    <span />

                    <Button type="submit" loading={createActivityState.loading}>
                      Create
                    </Button>
                  </Stack>
                </form>
              </Form>
            </>
          )}
        </Stack>
      </RwdLayout>

      {/* Modal content */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fz="xl" fw={500}>
            Confirm activity
          </Text>
        }
        centered
      >
        <Stack gap="lg">
          <Text fz="sm">
            Please confirm the details of your new activity
            <br />
            You cannot edit the date and post after submitting
          </Text>

          <Stack gap="sm">
            <Group justify="space-between" gap="xs">
              <Text fz="sm" fw={500}>
                Date
              </Text>
              <Text
                fz="sm"
                c="dimmed"
              >{`${formatDate(new Date())} - ${formatDate(new Date())}`}</Text>
            </Group>
            <Group justify="space-between" gap={4}>
              <Text fz="sm" fw={500}>
                Post
              </Text>
              <Text fz="sm" c="dimmed">
                Instagram - 123123
              </Text>
            </Group>
            <Group justify="space-between" gap="xs">
              <Text fz="sm" fw={500}>
                Prize
              </Text>
              <Text fz="sm" c="dimmed">
                USDT 234234
              </Text>
            </Group>
          </Stack>

          <Checkbox
            checked={checked}
            onChange={event => setChecked(event.currentTarget.checked)}
            label="Approve token to deposit in the vault"
          />

          <Text fz="xs" c="dimmed">
            After ended, the prize will be distributed to the supporters <br />
            Remaining tokens will be returned to your wallet
          </Text>

          <Group justify="right">
            <Button onClick={close} variant="outline" color="dark">
              Cancel
            </Button>
            <Button disabled={!checked}>Submit</Button>
          </Group>
        </Stack>
      </Modal>

      <Space h={100} />
    </>
  )
}
