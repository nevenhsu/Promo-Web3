'use client'

import { useRef, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { Stepper, Stack, Space, Group, Progress } from '@mantine/core'
import { Title, Text, Button, Checkbox } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Form, { type FormRef } from '../Form'
import CreateFields from '../Form/CreateFields'
import Completion, { Status } from '@/components/share/Completion'
import { formatDate } from '@/utils/date'
import { useWeb3 } from '@/wallet/Web3Context'
import { useActivityTx } from './useActivityTx'
import { defaultChain } from '@/wallet/variables'
import type { ActivityData } from '@/models/activity'

export default function ProfileActivityNew() {
  const { createAndDepositWithPermit } = useActivityTx()
  const { chainId, walletAddress } = useWeb3()
  const notConnected = !chainId || !walletAddress

  const formRef = useRef<FormRef>(null)

  // state
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState(Status.Init)
  const [error, setError] = useState<string>()

  const [checked, setChecked] = useState(false)
  const [data, setData] = useState<ActivityData>()

  const [createActivityState, createActivity] = useAsyncFn(async (data: ActivityData) => {
    if (status === Status.Pending) return
    setStatus(Status.Pending)

    try {
      // send transaction
      const result = await createAndDepositWithPermit(data, async values => {
        const { hash, success, chainId } = values

        if (!success) {
          setStatus(Status.Failed)
          setError('Transaction failed')
          return
        }

        // upload to db
        setStatus(Status.Success)
      })
    } catch (error) {
      console.error(error)
      setStatus(Status.Failed)
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }, [])

  // TODO: refactor this
  const { loading, value } = createActivityState

  const handleSubmit = (data: ActivityData) => {
    setData(data)
    setActive(1)
  }

  return (
    <>
      <RwdLayout>
        <>
          <Stepper
            size="sm"
            iconSize={32}
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
          >
            <Stepper.Step
              label="First step"
              description="Fill out this form"
              allowStepSelect={false}
            >
              <Stack gap="xl">
                <Form ref={formRef}>
                  <form
                    onSubmit={formRef.current?.getForm().onSubmit(
                      values => {
                        const { startTime, endTime, activityType, ...rest } = values
                        if (startTime && endTime) {
                          handleSubmit({
                            ...rest,
                            chainId: chainId || defaultChain.id,
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

                      <Button type="submit" disabled={notConnected}>
                        Next
                      </Button>
                    </Stack>
                  </form>
                </Form>
              </Stack>
            </Stepper.Step>

            <Stepper.Step
              label="Second step"
              description="Confirm your activity"
              allowStepSelect={false}
            >
              <Stack gap="lg">
                <Text fz="sm">
                  Please confirm the details of your new activity
                  <br />
                  You cannot edit the date and post after submitting
                </Text>

                {data ? (
                  <Stack gap="sm">
                    <Group justify="space-between" gap="xs">
                      <Text fz="sm" fw={500}>
                        Date
                      </Text>
                      <Text
                        fz="sm"
                        c="dimmed"
                      >{`${formatDate(data.startTime)} - ${formatDate(data.endTime)}`}</Text>
                    </Group>
                    <Group justify="space-between" gap={4}>
                      <Text fz="sm" fw={500}>
                        Post
                      </Text>
                      <Text fz="sm" c="dimmed">
                        {`${data.socialMedia} - ${data.details.link}`}
                      </Text>
                    </Group>
                    <Group justify="space-between" gap="xs">
                      <Text fz="sm" fw={500}>
                        Prize
                      </Text>
                      <Text fz="sm" c="dimmed">
                        {`${data.airdrop.amount} ${data.airdrop.symbol}`}
                      </Text>
                    </Group>
                  </Stack>
                ) : null}

                <Checkbox
                  checked={checked}
                  onChange={event => setChecked(event.currentTarget.checked)}
                  label="Approve token to deposit in the vault"
                />

                <Text fz="xs" c="dimmed">
                  The prize will be distributed to the supporters <br />
                  Remaining tokens will be returned to your wallet
                </Text>

                <Group justify="right">
                  <Button variant="outline" color="dark">
                    Cancel
                  </Button>
                  <Button disabled={!checked || !data} onClick={() => createActivity(data!)}>
                    Submit
                  </Button>
                </Group>
              </Stack>
            </Stepper.Step>

            <Stepper.Completed>
              <Completion
                onOk={() => {}}
                status={status}
                text={{
                  pending: 'Processing...',
                  okay: status === Status.Success ? 'Go to edit details' : 'Close',
                }}
                header={
                  <>
                    <Title order={3}>{loading ? 'Creating activity' : 'Congrats!'}</Title>
                  </>
                }
                description={
                  <Stack>
                    {status === Status.Pending && <Progress w="100%" value={100} animated />}

                    <Text fz="sm" c="dimmed" mb="xl">
                      {status === Status.Pending
                        ? `Don't close this window. Wait for the transaction to be confirmed, this may take
                                         a few minutes.`
                        : status === Status.Success
                          ? 'Your activity has been created successfully!'
                          : status === Status.Failed
                            ? 'Failed to create your activity. Please try again later.'
                            : ''}
                    </Text>

                    <Space h={40} />
                  </Stack>
                }
              />
            </Stepper.Completed>
          </Stepper>
        </>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
