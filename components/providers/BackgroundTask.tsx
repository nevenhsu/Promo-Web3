'use client'

import { useEffect } from 'react'
import useAutoAuth from '@/hooks/useAutoAuth'
import { useViewportSize } from '@mantine/hooks'
import { useScreenQuery } from '@/hooks/useScreenQuery'
import { useAppContext } from '@/store/AppContext'

export default function BackgroundTask() {
  const { updateState } = useAppContext()

  useAutoAuth() // connect privy to mongodb

  // update app context state
  useScreenQuery()

  const viewportSize = useViewportSize()

  useEffect(() => {
    updateState({ viewportSize })
  }, [viewportSize])

  return null
}
