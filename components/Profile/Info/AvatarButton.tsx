'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import { FileButton, Avatar, ThemeIcon } from '@mantine/core'
import { PiImageFill } from 'react-icons/pi'

export type AvatarButtonRef = {
  getFile: () => { file: File | null; dataURI: string | undefined }
}

type AvatarButtonProps = {
  url: string
  onChange?: (file: File | null) => void
  onDataURLChange?: (dataURI: string | undefined) => void
}

export default forwardRef<AvatarButtonRef, AvatarButtonProps>(function AvatarButton(props, ref) {
  const { url, onChange, onDataURLChange } = props
  const [file, setFile] = useState<File | null>(null)
  const [dataURI, setDataURI] = useState<string>()

  useImperativeHandle(ref, () => ({
    getFile: () => ({ file, dataURI }),
  }))

  return (
    <>
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
          <span {...props} className="c-pointer">
            <Avatar w="100%" h="100%" color="white" src={dataURI || url || null} />
            <ThemeIcon
              size="sm"
              variant="light"
              color="dark"
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
              }}
            >
              <PiImageFill size={16} />
            </ThemeIcon>
          </span>
        )}
      </FileButton>
    </>
  )
})
