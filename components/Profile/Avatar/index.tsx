'use client'

import { useState, useRef } from 'react'
import { useMantineTheme } from '@mantine/core'
import { uploadImage } from '@/services/user'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { updateUser } from '@/store/slices/user'
import { Group, Box, Stack, Paper, Space } from '@mantine/core'
import { FileButton, Button, Text, Slider, ActionIcon } from '@mantine/core'
import AvatarEditor from 'react-avatar-editor'
import RwdLayout from '@/components/share/RwdLayout'
import { BucketType } from '@/types/db'
import { PiImageFill } from 'react-icons/pi'

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
  const [rotate, setRotate] = useState(0)

  const hasAvatar = !file && Boolean(avatar)
  const uploaded = saved === true

  const getImageUrl = async () => {
    try {
      if (editor.current && file) {
        setUploading(true)
        const canvasScaled = editor.current.getImageScaledToCanvas()
        const dataURI = canvasScaled.toDataURL()

        // TODO: Uncomment this after implementing GCP
        //  const gcpUrl = await uploadImage(dataURI, BucketType.avatar)
        //  dispatch(updateUser({ details: { avatar: gcpUrl } }))
        setSaved(true)
      }
    } catch (err) {
      console.error(err)
    }
    setUploading(false)
  }

  return (
    <>
      <RwdLayout>
        <Stack w={300} mx="auto" gap="xl">
          <Paper pos="relative" radius="md" shadow="xs" style={{ overflow: 'hidden' }}>
            <AvatarEditor
              ref={editor}
              image={file || avatar}
              width={300}
              height={300}
              border={0}
              scale={scale}
              rotate={rotate}
              borderRadius={1000}
              backgroundColor={theme.colors.white}
              color={[255, 255, 255, 0.6]}
              style={{
                display: 'block',
                pointerEvents: uploaded ? 'none' : 'all',
              }}
              onImageReady={() => setSaved(false)}
              onMouseUp={() => {
                if (!file && fileBtn.current) {
                  fileBtn.current.click()
                }
              }}
            />

            <FileButton onChange={v => (v ? setFile(v) : null)} accept="image/png,image/jpeg">
              {props => (
                <ActionIcon
                  {...props}
                  ref={fileBtn}
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="dark"
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 12,
                  }}
                >
                  <PiImageFill size={20} />
                </ActionIcon>
              )}
            </FileButton>
          </Paper>

          <Stack>
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

            <Box>
              <Text size="sm">Rotate</Text>
              <Slider
                value={rotate}
                onChange={v => {
                  setRotate(v)
                  setSaved(false)
                }}
                min={0}
                max={360}
                label={value => value.toFixed(1)}
                step={1}
                disabled={!file || uploaded}
              />
            </Box>
          </Stack>

          <Group grow>
            <Button onClick={getImageUrl} loading={uploading || updating} disabled={!file || saved}>
              {saved || hasAvatar ? 'Saved' : 'Save'}
            </Button>
          </Group>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
