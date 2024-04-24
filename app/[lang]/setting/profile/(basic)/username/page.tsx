'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { updateUser } from '@/store/slices/user'
import { checkUsername } from '@/services/user'
import { UserField } from '@/types/db'
import { TextInput, Button, Paper, Stack, Box, ActionIcon } from '@mantine/core'
import TitleBar from '@/components/TitleBar'
import { IoCloseOutline } from 'react-icons/io5'
import { cleanup } from '@/utils/helper'

export default function Username() {
  const dispatch = useAppDispatch()
  const { data, updating } = useAppSelector(state => state.user)
  const [value, setValue] = useState(data.username || '')
  const [error, setError] = useState('')

  const isSame = Boolean(value) && data.username === value

  const handleSave = async () => {
    if (value && !isSame) {
      // check username
      const available = await checkUsername(value)
      if (available) {
        dispatch(updateUser({ field: UserField.username, value }))
      } else {
        setError(`${value} is used.`)
      }
    }
  }

  useEffect(() => setError(''), [value])

  return (
    <>
      <TitleBar title="Username" />
      <Paper p={16}>
        <Stack>
          <TextInput
            h={72}
            value={value}
            onChange={event => setValue(cleanup(event.currentTarget.value))}
            rightSection={
              <ActionIcon onClick={() => setValue('')} variant="transparent" aria-label="Clear">
                <IoCloseOutline />
              </ActionIcon>
            }
            leftSectionPointerEvents="none"
            leftSection="@"
            description="Only include a~z 0~9 _ . -"
            error={error}
          />
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
