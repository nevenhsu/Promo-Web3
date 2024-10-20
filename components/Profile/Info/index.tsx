'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/navigation'
import { Stack, Box, Space, Group, Divider, Text } from '@mantine/core'
import { TextInput, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { notifications } from '@mantine/notifications'
import { updateProfile } from '@/store/slices/user'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { useForm, hasLength } from '@mantine/form'
import { usePrevious } from 'react-use'
import AvatarButton, { type AvatarButtonRef } from './AvatarButton'
import { getPublicUser } from '@/services/user'
import { cleanup } from '@/utils/helper'

export default function ProfileInfo() {
  const dispatch = useAppDispatch()

  const avatarRef = useRef<AvatarButtonRef>(null)

  const { updating, data } = useAppSelector(state => state.user)
  const { username = '', name = '', details } = data
  const avatar = details?.avatar || ''
  const prevUpdating = usePrevious(updating)

  const [image, setImage] = useState<string>(avatar)
  const [imageError, setImageError] = useState<string>()
  const avatarURI = imageError ? '' : image

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
  const alreadyUpdated =
    values.username === username && values.name === name && avatar === avatarURI

  const handleSubmit = (values: typeof form.values) => {
    if (values.name && values.username) {
      // Update user info
      updateInfo(values.name, cleanup(values.username), avatarURI)
    }
  }

  const updateInfo = async (name: string, username: string, avatarURI: string) => {
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
      dispatch(updateProfile({ name, username, avatarURI }))
    } catch (err) {
      console.error(err)
      // TODO: Show error notification
    }
  }

  useEffect(() => {
    if (prevUpdating && !updating) {
      notifications.show({
        title: 'Profile updated',
        message: 'Your profile has been updated successfully',
        color: 'green',
      })
    }
  }, [updating, prevUpdating])

  useEffect(() => {
    setImage(details?.avatar || '')
  }, [details?.avatar])

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Stack gap="xs">
            {/* Avatar */}
            <Box pos="relative" w={64} h={64} mx="auto">
              <AvatarButton
                ref={avatarRef}
                url={avatar}
                onChange={file => {
                  if (file && file.size >= 1024 * 1024 * 10) {
                    setImageError('Image size cannot exceed 10mb')
                  } else {
                    setImageError(undefined)
                  }
                }}
                onDataURLChange={dataURI => {
                  setImage(dataURI || '')
                }}
              />
            </Box>

            <Text fz="xs" ta="center" c="red">
              {imageError}
            </Text>
          </Stack>

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
                label="Username"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />

              <span />

              <Group justify="right">
                <Link href="/profile">
                  <Button variant="outline" color="dark">
                    Back
                  </Button>
                </Link>

                <Button type="submit" loading={updating} disabled={alreadyUpdated}>
                  {alreadyUpdated ? 'Updated' : 'Update'}
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
