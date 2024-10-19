'use client'

import RwdLayout from '@/components/share/RwdLayout'
import { Space, Group, Stack, Paper, Button, Text, Title, ThemeIcon } from '@mantine/core'
import type { User } from '@/models/user'

export default function UserProfile({ data }: { data: User }) {
  return (
    <>
      <RwdLayout></RwdLayout>

      <Space h={100} />
    </>
  )
}
