'use client'

import { useEffect } from 'react'
import { Link } from '@/navigation'
import { Stack, Box, Space, Group, Divider } from '@mantine/core'
import { Avatar, TextInput, Button, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { notifications } from '@mantine/notifications'
import { updateUser } from '@/store/slices/user'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { useForm, hasLength } from '@mantine/form'
import { usePrevious } from 'react-use'
import { getPublicUser } from '@/services/user'
import { cleanup } from '@/utils/helper'
import { PiImageFill } from 'react-icons/pi'

export default function ProfileInfo() {
  const dispatch = useAppDispatch()

  const { updating, data } = useAppSelector(state => state.user)
  const { username = '', name = '', details } = data
  const prevUpdating = usePrevious(updating)

  useEffect(() => {
    if (prevUpdating && !updating) {
      notifications.show({
        title: 'Profile updated',
        message: 'Your profile has been updated successfully',
        color: 'green',
      })
    }
  }, [updating, prevUpdating])

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name,
      username,
    },
    validate: {
      name: hasLength({ min: 1, max: 20 }, 'Should be between 1 and 20 characters'),
      username: o => {
        const cleaned = cleanup(o)
        form.setFieldValue('username', cleaned)
        return hasLength({ min: 2, max: 20 }, 'Should be between 2 and 20 characters')(cleaned)
      },
    },
  })

  const values = form.getValues()
  const alreadyUpdated = values.username === username && values.name === name

  const handleSubmit = (values: typeof form.values) => {
    if (values.name && values.username) {
      // Update user info
      updateInfo(values.name, cleanup(values.username))
    }
  }

  const updateInfo = async (name: string, username: string) => {
    try {
      // Check if username is unique
      if (username !== data.username) {
        const isUnique = await isUniqueUsername(username)
        if (!isUnique) {
          form.setFieldError('username', 'This username is taken, please try another')
          return
        }
      }

      // Update user info
      dispatch(updateUser({ name, username }))
    } catch (err) {
      console.error(err)
      // TODO: Show error notification
    }
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          {/* Avatar */}
          <Box pos="relative" w={64} h={64} mx="auto">
            <Link href="/profile/info/avatar">
              <Avatar w="100%" h="100%" color="white" src={details?.avatar} />

              <ThemeIcon
                size="sm"
                variant="light"
                color="black"
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                }}
              >
                <PiImageFill size={16} />
              </ThemeIcon>
            </Link>
          </Box>

          <Divider />

          <form
            onSubmit={form.onSubmit(
              values => handleSubmit(values),
              (validationErrors, values, event) => {
                console.log(
                  validationErrors, // <- form.errors at the moment of submit
                  values, // <- form.getValues() at the moment of submit
                  event // <- form element submit event
                )
              }
            )}
          >
            <Stack>
              <TextInput
                data-autofocus
                label="Full Name"
                key={form.key('name')}
                {...form.getInputProps('name')}
              />

              <TextInput
                data-autofocus
                label="Username"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />

              <span />

              <Group justify="right">
                <Link href="/profile">
                  <Button variant="outline" color="black">
                    Back
                  </Button>
                </Link>

                <Button type="submit" loading={updating} disabled={alreadyUpdated}>
                  Update Profile
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

async function isUniqueUsername(username: string) {
  const user = await getPublicUser(username)
  return !user
}
