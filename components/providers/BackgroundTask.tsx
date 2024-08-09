'use client'

import { useEffect } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { useAppContext } from '@/store/AppContext'
import { useSyncAuth } from '@/hooks/bg/useSyncAuth'
import { useSyncAccounts } from '@/hooks/bg/useSyncAccounts'
import { useSyncWallets } from '@/hooks/bg/useSyncWallets'
import { useBreakPoints } from '@/hooks/bg/useBreakPoints'

export default function BackgroundTask() {
  const { updateState } = useAppContext()

  useSyncAuth() // connect privy to next-auth
  useSyncAccounts() // auto update link accounts
  useSyncWallets() // auto update wallets

  useBreakPoints() // update break points in app context

  const viewportSize = useViewportSize()

  useEffect(() => {
    updateState({ viewportSize })
  }, [viewportSize])

  return null
}
