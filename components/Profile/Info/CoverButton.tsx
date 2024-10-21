'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import { FileButton, ThemeIcon, Box, AspectRatio, Button } from '@mantine/core'
import { PiImageFill } from 'react-icons/pi'

type CoverButtonProps = {
  url: string
  onChange?: (file: File | null) => void
  onDataURLChange?: (dataURI: string | undefined) => void
}

export default function CoverButton(props: CoverButtonProps) {
  const { url, onChange, onDataURLChange } = props
  const [file, setFile] = useState<File | null>(null)
  const [dataURI, setDataURI] = useState<string>()

  const imgSrc = dataURI || url

  return (
    <Box pos="relative">
      <AspectRatio ratio={4 / 1}>
        <Box bg="gray.1" style={{ borderRadius: 4, overflow: 'hidden' }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="cover"
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </Box>
      </AspectRatio>

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
          <Button
            {...props}
            size="compact-xs"
            variant="light"
            color="dark"
            style={{
              position: 'absolute',
              top: 8,
              right: 4,
            }}
          >
            Upload cover
          </Button>
        )}
      </FileButton>
    </Box>
  )
}
