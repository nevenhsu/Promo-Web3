'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { updateUser } from '@/store/slices/user'
import { UserField } from '@/types/db'
import { TextInput, Button, Paper, Stack, Box } from '@mantine/core'
import TitleBar from '@/components/TitleBar'

export default function Name() {
  const dispatch = useAppDispatch()
  const { data, updating } = useAppSelector(state => state.user)
  const [value, setValue] = useState(data.name || '')

  const isSame = Boolean(value) && data.name === value

  const handleSave = () => {
    if (value && !isSame) {
      dispatch(updateUser({ field: UserField.name, value }))
    }
  }

  return (
    <>
      <TitleBar title="Name" />
      <Paper p={16}>
        <Stack>
          <TextInput value={value} onChange={event => setValue(event.currentTarget.value)} />
          <Box ta="right">
            <Button onClick={handleSave} loading={updating} disabled={isSame || !value}>
              {isSame ? 'Saved' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  )
}
