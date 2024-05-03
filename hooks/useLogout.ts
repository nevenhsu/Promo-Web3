'use client'

import { signOut } from 'next-auth/react'
import { useLogout as _useLogout } from '@privy-io/react-auth'
import { modals } from '@mantine/modals'

export default function useLogout() {
  const { logout } = _useLogout({
    onSuccess: () => {
      signOut({ callbackUrl: '/' })
    },
  })

  const openModal = (children: React.ReactNode) =>
    modals.openConfirmModal({
      title: 'See you next time',
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      onConfirm: logout,
      children,
    })

  return openModal
}
