'use client'

import { Link } from '@/navigation'
import { Stack, Avatar, Box, Space, TextInput, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useAppSelector } from '@/hooks/redux'
import { useForm, hasLength } from '@mantine/form'
import { PiImageFill } from 'react-icons/pi'
import classes from '../index.module.css'

export default function ProfileInfo() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
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

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Box pos="relative" w={64} h={64} mx="auto">
            <Link href="/profile/info/avatar">
              <Avatar w="100%" h="100%" color="white" src={details?.avatar} />

              <Box className={classes.avatarIcon}>
                <PiImageFill size={16} />
              </Box>
            </Link>
          </Box>

          <form
            onSubmit={form.onSubmit(
              values => {
                console.log(values)
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
                label="Name"
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

              <Button type="submit">Update Profile</Button>
            </Stack>
          </form>
        </Stack>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
