'use client'

import { useState, useRef } from 'react'
import { useMantineTheme } from '@mantine/core'
import { uploadImage } from '@/services/user'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { updateUser } from '@/store/slices/user'
import { FileButton, Button, Group, Box, Stack, Text, Slider, Image } from '@mantine/core'
import AvatarEditor from 'react-avatar-editor'
import RwdLayout from '@/components/share/RwdLayout'
import { BucketType } from '@/types/db'

export default function Avatar() {
  const dispatch = useAppDispatch()

  const editor = useRef<AvatarEditor>(null)
  const fileBtn = useRef<HTMLButtonElement>(null)
  const theme = useMantineTheme()
  const { data, updating } = useAppSelector(state => state.user)
  const avatar = data.details?.avatar || ''

  const [file, setFile] = useState<File | null>(null)
  const [saved, setSaved] = useState<boolean>()
  const [uploading, setUploading] = useState(false)
  const [scale, setScale] = useState(1)

  const hasAvatar = !file && Boolean(avatar)
  const uploaded = saved === true

  const getImageUrl = async () => {
    try {
      if (editor.current && file) {
        setUploading(true)
        const canvasScaled = editor.current.getImageScaledToCanvas()
        const dataURI = canvasScaled.toDataURL()

        const gcpUrl = await uploadImage(dataURI, BucketType.avatar)
        dispatch(updateUser({ details: { avatar: gcpUrl } }))
        setSaved(true)
      }
    } catch (err) {
      console.error(err)
    }
    setUploading(false)
  }

  return (
    <RwdLayout>
      <Stack w={340} mx="auto" gap="xl">
        <Box pos="relative" h={360}>
          <AvatarEditor
            ref={editor}
            image={file || ''}
            width={300}
            height={300}
            border={20}
            scale={scale}
            borderRadius={999}
            backgroundColor={theme.colors.dark[6]}
            style={{
              borderRadius: 16,
              position: 'relative',
              zIndex: 1,
              pointerEvents: uploaded ? 'none' : 'all',
            }}
            onImageReady={() => setSaved(false)}
            onMouseUp={() => {
              if (!file && fileBtn.current) {
                fileBtn.current.click()
              }
            }}
          />
          {hasAvatar ? (
            <Box pos="absolute" top={30} left={30} style={{ pointerEvents: 'none' }}>
              <Image width={300} height={300} src={avatar || ''} alt="" />
            </Box>
          ) : null}
        </Box>

        <Group justify="space-between">
          <FileButton onChange={v => (v ? setFile(v) : null)} accept="image/png,image/jpeg">
            {props => (
              <Button {...props} ref={fileBtn} variant="default">
                Select image
              </Button>
            )}
          </FileButton>
          <Button onClick={getImageUrl} loading={uploading || updating} disabled={!file || saved}>
            {saved || hasAvatar ? 'Saved' : 'Save'}
          </Button>
        </Group>

        <Box>
          <Text size="sm">Zoom</Text>
          <Slider
            value={scale}
            onChange={v => {
              setScale(v)
              setSaved(false)
            }}
            min={1}
            max={3}
            label={value => value.toFixed(1)}
            step={0.1}
            disabled={!file || uploaded}
          />
        </Box>
      </Stack>
    </RwdLayout>
  )
}
