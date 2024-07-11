'use client'

import { useState } from 'react'
import { Space, Stack, Avatar, Group, Box } from '@mantine/core'
import { Text, Title, Button, TextInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiBarcode } from 'react-icons/pi'

export default function ReferCode() {
  const [value, setValue] = useState('')

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Referral Code</Title>

          <TextInput
            leftSection={<PiBarcode size={24} />}
            placeholder="Enter referral code"
            value={value}
            onChange={event => setValue(event.currentTarget.value)}
          />
          <Button>Submit referral code</Button>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
