'use client'

import { useEffect } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { useAppContext } from '@/store/AppContext'
import { useSyncAuth } from '@/hooks/bg/useSyncAuth'
import { useSyncAccounts } from '@/hooks/bg/useSyncAccounts'
import { useSyncWallets } from '@/hooks/bg/useSyncWallets'
import { useBreakPoints } from '@/hooks/bg/useBreakPoints'
import { useSyncTokenBal } from '@/hooks/bg/useSyncTokenBal'
import { useOAuth } from '@/hooks/bg/useOAuth'

export default function BackgroundTask() {
  const { updateState } = useAppContext()

  useSyncAuth() // connect privy to next-auth
  useSyncAccounts() // auto update link accounts
  useSyncWallets() // auto update wallets
  useSyncTokenBal() // auto update token
  useOAuth() // auto update instagram token

  useBreakPoints() // update break points in app context

  const viewportSize = useViewportSize()

  useEffect(() => {
    updateState({ viewportSize })
  }, [viewportSize])

  return null
}
