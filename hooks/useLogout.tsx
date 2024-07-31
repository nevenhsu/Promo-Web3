'use client'

import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useLogout as _useLogout } from '@privy-io/react-auth'
import { modals } from '@mantine/modals'
import { Text, Box, LoadingOverlay } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export default function useLogout() {
  const contentRef = useRef<ContentRef>(null)

  // Privy logout
  const { logout } = _useLogout({
    onSuccess: () => {},
  })

  const handleConfirm = () => {
    if (contentRef.current) {
      contentRef.current.open()
    }
    logout()
  }

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: 'Logout',
      children: (
        <>
          <Content ref={contentRef} />
        </>
      ),
      labels: { confirm: 'Yes, logout', cancel: 'Cancel' },
      onConfirm: handleConfirm,
      closeOnConfirm: false,
    })

  return { openLogoutModal }
}

export type ContentRef = {
  open: () => void
}

const Content = forwardRef<ContentRef, {}>(function Content(props, ref) {
  const [visible, { open, close }] = useDisclosure(false)

  useImperativeHandle(ref, () => ({
    open,
  }))

  return (
    <>
      <Box pos="relative" mih={60}>
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        <Text fz="sm" mb="xl">
          Are you sure you want to logout?
        </Text>
      </Box>
    </>
  )
})
