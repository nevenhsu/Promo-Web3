'use client'

import { useRouter } from '@/navigation'
import { signOut } from 'next-auth/react'
import { useLogout as _useLogout } from '@privy-io/react-auth'
import { modals } from '@mantine/modals'
import { Text } from '@mantine/core'

export default function useLogout() {
  const router = useRouter()

  const { logout } = _useLogout({
    onSuccess: () => {
      router.push('/')
    },
  })

  const handleConfirm = () => {
    logout()
    signOut()
  }

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: 'See you next time',
      children: (
        <Text fz="sm" mb="xl">
          Are you sure you want to logout?
        </Text>
      ),
      labels: { confirm: 'Yes, logout', cancel: 'Cancel' },
      onConfirm: handleConfirm,
    })

  return { openLogoutModal }
}
