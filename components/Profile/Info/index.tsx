'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/navigation'
import { Stack, Box, Space, Group, Divider, Text, Textarea } from '@mantine/core'
import { TextInput, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { notifications } from '@mantine/notifications'
import { updateProfile } from '@/store/slices/user'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { useForm, hasLength } from '@mantine/form'
import { usePrevious } from 'react-use'
import AvatarButton from './AvatarButton'
import CoverButton from './CoverButton'
import { getPublicUser } from '@/services/user'
import { cleanup } from '@/utils/helper'

export default function ProfileInfo() {
  const dispatch = useAppDispatch()

  const { updating, data } = useAppSelector(state => state.user)
  const prevUpdating = usePrevious(updating)

  const { username = '', name = '', details } = data
  const avatar = details?.avatar || ''
  const cover = details?.cover || ''
  const bio = details?.bio || ''
  const link = details?.link || ''

  // avatar
  const [image, setImage] = useState<string>(avatar)
  const [imageError, setImageError] = useState<string>()
  const avatarURI = imageError ? '' : image

  const [coverImg, setCoverImg] = useState<string>(cover)
  const [coverError, setCoverError] = useState<string>()
  const coverURI = coverError ? '' : coverImg

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name,
      username,
      bio,
      link,
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

  // Check if form values are the same as the current user data
  const values = form.getValues()
  const alreadyUpdated =
    values.username === username &&
    values.name === name &&
    values.bio === bio &&
    values.link === link &&
    avatar === avatarURI &&
    cover === coverURI

  const handleSubmit = (values: typeof form.values) => {
    if (values.name && values.username) {
      // Update user info
      updateInfo(values.name, cleanup(values.username), values.bio, values.link)
    }
  }

  const updateInfo = async (name: string, username: string, bio: string, link: string) => {
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
      dispatch(updateProfile({ name, username, avatarURI, coverURI, bio, link }))
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

  // update image when details change
  useEffect(() => {
    setImage(details?.avatar || '')
  }, [details?.avatar])

  useEffect(() => {
    setCoverImg(details?.cover || '')
  }, [details?.cover])

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Stack gap="xs">
            <Box mb={-32}>
              {/* Cover */}
              <CoverButton
                url={cover}
                onChange={file => {
                  if (file && file.size >= 1024 * 1024 * 10) {
                    setCoverError('Image size cannot exceed 10mb')
                  } else {
                    setCoverError(undefined)
                  }
                }}
                onDataURLChange={dataURI => {
                  setCoverImg(dataURI || '')
                }}
              />

              {/* Avatar */}
              <Box pos="relative" w={64} h={64} mx="auto" top={-32}>
                <AvatarButton
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
            </Box>

            <Text fz="xs" ta="center" c="red">
              {imageError || coverError || ''}
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

              <Textarea label="Bio" key={form.key('bio')} {...form.getInputProps('bio')} />

              <TextInput
                label="Link"
                key={form.key('link')}
                {...form.getInputProps('link')}
                placeholder="https://"
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
