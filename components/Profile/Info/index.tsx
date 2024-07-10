'use client'

import { Link } from '@/navigation'
import { Stack, Box, Space, Divider } from '@mantine/core'
import { Avatar, TextInput, Button, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { updateUser } from '@/store/slices/user'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { useForm, hasLength } from '@mantine/form'
import { cleanup } from '@/utils/helper'
import { PiImageFill } from 'react-icons/pi'

export default function ProfileInfo() {
  const dispatch = useAppDispatch()
  const { updating, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name,
      username,
    },
    validate: {
      name: hasLength({ min: 1 }, 'Name should not be empty'),
      username: hasLength({ min: 1 }, 'Username should not be empty'),
    },
  })

  const handleSubmit = (name: string, username: string) => {
    dispatch(updateUser({ name, username }))
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
              values => {
                if (values.name && values.username) {
                  const cleanUsername = cleanup(values.username)
                  form.setFieldValue('username', cleanUsername)
                  handleSubmit(values.name, cleanUsername)
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

              <Button type="submit" loading={updating}>
                Update Profile
              </Button>
            </Stack>
          </form>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
