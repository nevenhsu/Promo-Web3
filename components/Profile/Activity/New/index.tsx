'use client'

import * as _ from 'lodash-es'
import { useRouter } from '@/i18n/routing'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'
import { Stepper, Stack, Space, Group, Progress, Badge } from '@mantine/core'
import { Text, Button, Checkbox } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Form from '../Form'
import CreateFields from '../Form/CreateFields'
import Completion, { Status } from '@/components/share/Completion'
import { formatDate } from '@/utils/date'
import { useWeb3 } from '@/wallet/Web3Context'
import { useActivityTx } from './useActivityTx'
import { createCreatorActivity, updateActivityNFT } from '@/services/activity'
import type { ActivityData } from '@/components/Profile/Activity/Form/Context'
import type { FormType } from '../Form'

export default function ProfileActivityNew() {
  const router = useRouter()
  const { createAndDeposit } = useActivityTx()
  const { chainId, currentClient } = useWeb3()
  const notConnected = !chainId || !currentClient

  // state
  const [form, setForm] = useState<FormType>()
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState(Status.Init)
  const [error, setError] = useState<string>()
  const [slug, setSlug] = useState<string>() // new activity slug
  const created = status === Status.Success && !!slug

  const [checked, setChecked] = useState(false)
  const [data, setData] = useState<ActivityData>()

  const submitTx = async (data: ActivityData) => {
    const handleError = (error: unknown) => {
      console.error(error)
      setStatus(Status.Failed)
      if (error instanceof Error) {
        setError(error.message)
      }
    }

    try {
      // send transaction
      const result = await createAndDeposit(
        data,
        async values => {
          const { hash, success } = values

          if (!success) {
            setStatus(Status.Failed)
            setError('Transaction failed')
            return
          }

          try {
            // upload to db
            const newActivity = await createCreatorActivity(data)
            const updated = await updateActivityNFT(newActivity.slug, hash)
            if (updated) {
              setSlug(newActivity.slug)
              setStatus(Status.Success)
            } else {
              throw new Error('Failed to update activity NFT')
            }
          } catch (error) {
            handleError(error)
          }
        },
        error => {
          handleError(error)
        }
      )
    } catch (error) {
      handleError(error)
    }
  }

  // Step 2: Create activity
  const [createActivityState, createActivity] = useAsyncFn(async (data: ActivityData) => {
    if (status === Status.Pending) return
    setStatus(Status.Pending)
    setActive(prev => prev + 1)

    // submit transaction
    submitTx(data)
  }, [])

  // Step 1: Form submission
  const handleSubmit = (data: ActivityData) => {
    setData(data)
    setActive(prev => prev + 1)
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
                <Form onReady={setForm}>
                  <form
                    onSubmit={form?.onSubmit(
                      values => {
                        const { startTime, endTime, activityType, ...rest } = values
                        if (startTime && endTime && chainId) {
                          handleSubmit({
                            ...rest,
                            chainId,
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
                        {`${_.upperFirst(data.socialMedia)} - ${data.details.link}`}
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
                  <Button variant="outline" color="dark" onClick={() => setActive(active - 1)}>
                    Back
                  </Button>
                  <Button disabled={!checked || !data} onClick={() => createActivity(data!)}>
                    Submit
                  </Button>
                </Group>
              </Stack>
            </Stepper.Step>

            <Stepper.Completed>
              <Completion
                onOk={() => {
                  if (created) {
                    router.push({
                      pathname: '/profile/activity/[slug]',
                      params: { slug },
                    })
                  } else {
                    router.push('/profile/activity')
                  }
                }}
                status={status}
                text={{
                  pending: 'Processing...',
                  okay: created ? 'Go to update details' : 'Close',
                }}
                header={<></>}
                description={
                  <Stack>
                    {status === Status.Pending && <Progress w="100%" value={100} animated />}

                    {error ? (
                      <Badge size="sm" color="red" mx="auto">
                        {error}
                      </Badge>
                    ) : null}

                    <Text fz="sm" c="dimmed" mb="xl">
                      {status === Status.Pending
                        ? `Don't close this window. Wait for the transaction to be confirmed, this may take a few minutes.`
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
