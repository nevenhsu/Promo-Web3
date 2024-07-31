'use client'

import { useEffect } from 'react'
import useSyncAuth from '@/hooks/useSyncAuth'
import useLinkAccount from '@/hooks/useLinkAccount'
import { useViewportSize } from '@mantine/hooks'
import { useScreenQuery } from '@/hooks/useScreenQuery'
import { useAppContext } from '@/store/AppContext'

export default function BackgroundTask() {
  const { updateState } = useAppContext()

  useSyncAuth() // connect privy to next-auth
  useLinkAccount() // auto update link accounts

  useScreenQuery() // update app context state

  const viewportSize = useViewportSize()

  useEffect(() => {
    updateState({ viewportSize })
  }, [viewportSize])

  return null
}
