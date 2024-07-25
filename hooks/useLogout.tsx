'use client'

import { useAppDispatch } from '@/hooks/redux'
import { clearData as clearUser } from '@/store/slices/user'
import { clearData as clearUserActivityStatus } from '@/store/slices/userActivityStatus'
import { signOut } from 'next-auth/react'
import { useLogout as _useLogout } from '@privy-io/react-auth'
import { modals } from '@mantine/modals'
import { Text } from '@mantine/core'

export default function useLogout() {
  const dispatch = useAppDispatch()

  // Privy logout
  const { logout } = _useLogout({
    onSuccess: () => {
      dispatch(clearUser())
      dispatch(clearUserActivityStatus())
      signOut({ callbackUrl: '/home' }) // NextAuth logout
    },
  })

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: 'See you next time',
      children: (
        <Text fz="sm" mb="xl">
          Are you sure you want to logout?
        </Text>
      ),
      labels: { confirm: 'Yes, logout', cancel: 'Cancel' },
      onConfirm: logout,
    })

  return { openLogoutModal }
}
