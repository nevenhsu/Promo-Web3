'use client'

import { useState, forwardRef } from 'react'
import { FileButton, Box, Text, Avatar } from '@mantine/core'

type IconButtonProps = {
  url: string
  onChange?: (file: File | null) => void
  onDataURLChange?: (dataURI: string | undefined) => void
}

export default forwardRef<HTMLDivElement, IconButtonProps>(function IconButton(
  props: IconButtonProps,
  ref
) {
  const { url, onChange, onDataURLChange } = props
  const [file, setFile] = useState<File | null>(null)
  const [dataURI, setDataURI] = useState<string>()

  const imgSrc = dataURI || url

  return (
    <Box pos="relative">
      <FileButton
        onChange={file => {
          setFile(file)

          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              const dataURI = reader.result as string
              setDataURI(dataURI) // This will be the dataURI

              if (onDataURLChange) {
                onDataURLChange(dataURI)
              }
            }
            reader.readAsDataURL(file) // Convert the file to data URI
          } else {
            setDataURI(undefined)

            if (onDataURLChange) {
              onDataURLChange(undefined)
            }
          }

          if (onChange) {
            onChange(file)
          }
        }}
        accept="image/*"
      >
        {props => (
          <>
            <Box {...props} ref={ref} className="c-pointer" pos="relative" w={80}>
              <Avatar src={imgSrc || null} name={''} color="initials" size={80}>
                {' '}
              </Avatar>

              <Text className="absolute-center nowrap" fz="xs">
                {imgSrc ? '' : 'Upload icon'}
              </Text>
            </Box>
          </>
        )}
      </FileButton>
    </Box>
  )
})
