'use client'

import * as _ from 'lodash-es'
import { useState, useEffect, useRef } from 'react'
import { modals } from '@mantine/modals'
import { Stack, Badge, Group, Button, ThemeIcon, Box } from '@mantine/core'
import { useUserToken } from '@/store/contexts/app/userTokenContext'
import IconButton from './IconButton'
import TokenPaper from './TokenPaper'
import { PiImageFill } from 'react-icons/pi'

type ManageFlowProps = {
  docId: string
}

export default function ManageFlow({ docId }: ManageFlowProps) {
  const btnRef = useRef<HTMLDivElement>(null)
  const { tokens, updateTokenDoc, updateState } = useUserToken()
  const token = _.find(tokens, t => t._id === docId)

  // avatar
  const [iconImg, setIconImg] = useState('')
  const [error, setError] = useState<string>()
  const [iconError, setIconError] = useState<string>()
  const iconURI = iconError ? '' : iconImg
  const errorMsg = error || iconError

  const saved = iconImg === token?.icon

  const handleUpdate = async () => {
    if (!iconURI) {
      return
    }

    await updateTokenDoc({
      docId,
      iconURI: iconURI,
    })
  }

  useEffect(() => {
    if (token?.icon) {
      setIconImg(token.icon)
    }
  }, [token])

  useEffect(() => {
    if (updateState.error) {
      setError(updateState.error.message)
    } else {
      setError(undefined)
    }
  }, [updateState.error])

  return (
    <Stack gap="xl">
      <Stack align="center" gap="xs">
        <Box pos="relative">
          <IconButton
            ref={btnRef}
            url={iconURI}
            onChange={file => {
              if (file && file.size >= 1024 * 1024 * 10) {
                setIconError('Image size cannot exceed 10mb')
              } else {
                setIconError(undefined)
              }
            }}
            onDataURLChange={dataURI => {
              setIconImg(dataURI || '')
            }}
          />

          <ThemeIcon
            size="xs"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
            }}
          >
            <PiImageFill size={12} />
          </ThemeIcon>
        </Box>

        {errorMsg ? (
          <Badge size="sm" color="red">
            {errorMsg}
          </Badge>
        ) : null}
      </Stack>

      {token && (
        <TokenPaper
          name={token.name}
          symbol={token.symbol}
          icon={iconURI}
          leftSection={
            <Badge
              className="c-pointer"
              color="dark"
              variant="outline"
              onClick={() => {
                if (btnRef.current) {
                  btnRef.current.click()
                }
              }}
            >
              Upload
            </Badge>
          }
        />
      )}

      <Group justify="right">
        <Button color="dark" variant="outline" onClick={() => modals.closeAll()}>
          Close
        </Button>
        <Button onClick={handleUpdate} disabled={Boolean(iconError) || saved}>
          Save
        </Button>
      </Group>
    </Stack>
  )
}
