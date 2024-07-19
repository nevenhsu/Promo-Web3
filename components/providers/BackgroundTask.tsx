'use client'

import { useEffect } from 'react'
import useAutoAuth from '@/hooks/useAutoAuth'
import useLinkAccount from '@/hooks/useLinkAccount'
import { useViewportSize } from '@mantine/hooks'
import { useScreenQuery } from '@/hooks/useScreenQuery'
import { useAppContext } from '@/store/AppContext'

export default function BackgroundTask() {
  const { updateState } = useAppContext()

  useAutoAuth() // connect privy to mongodb
  useLinkAccount() // auto update link accounts

  useScreenQuery() // update app context state

  const viewportSize = useViewportSize()

  useEffect(() => {
    updateState({ viewportSize })
  }, [viewportSize])

  return null
}
