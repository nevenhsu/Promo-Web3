'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getPublicActivities, getPublicActivitiesTotal } from '@/services/activity'
import { useAsyncFn } from 'react-use'
import type { TPublicActivity } from '@/models/activity'
import type { AsyncState } from 'react-use/lib/useAsyncFn'

// the data and the number of times fetched
type ActivityResult = { data: TPublicActivity[]; times: number }

export type ActivityContextType = {
  limit: number
  maxPage: { ongoing: number; past: number }
  ongoing: ActivityResult
  past: ActivityResult
  fetchOngoingActivities: () => Promise<void>
  fetchOngoingState: AsyncState<void>
  fetchPastActivities: () => Promise<void>
  fetchPastState: AsyncState<void>
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const limit = 10
  const [maxPage, setMaxPage] = useState({ ongoing: 1, past: 1 })
  const [ongoing, setOngoing] = useState<ActivityResult>({ data: [], times: 0 })
  const [past, setPast] = useState<ActivityResult>({ data: [], times: 0 })

  const dataRef = useRef({
    hasMore: { ongoing: true, past: true },
    nextSkip: { ongoing: 0, past: 0 },
  })

  const [fetchOngoingState, fetchOngoingActivities] = useAsyncFn(async () => {
    const { hasMore, nextSkip } = dataRef.current
    if (!hasMore.ongoing) return

    const res = await getPublicActivities(true, nextSkip.ongoing, limit)
    dataRef.current.hasMore.ongoing = res.hasMore
    dataRef.current.nextSkip.ongoing = res.nextSkip || 0

    setOngoing(prev => {
      const data = _.uniqBy([...prev.data, ...res.data], 'index')
      const times = _.ceil(data.length / limit)
      return { data, times }
    })
  }, [])

  const [fetchPastState, fetchPastActivities] = useAsyncFn(async () => {
    const { hasMore, nextSkip } = dataRef.current
    if (!hasMore.past) return

    const res = await getPublicActivities(true, nextSkip.past, limit)
    dataRef.current.hasMore.past = res.hasMore
    dataRef.current.nextSkip.past = res.nextSkip || 0

    setPast(prev => {
      const data = _.uniqBy([...prev.data, ...res.data], 'index')
      const times = _.ceil(data.length / limit)
      return { data, times }
    })
  }, [])

  const fetchTotal = async () => {
    try {
      const { ongoing, past } = await getPublicActivitiesTotal()
      const maxOngoingPage = Math.floor(ongoing / limit) + 1
      const maxPastPage = Math.floor(past / limit) + 1
      setMaxPage({ ongoing: maxOngoingPage, past: maxPastPage })
    } catch (error) {
      console.error('Error fetching total activities:', error)
    }
  }

  useEffect(() => {
    fetchTotal()
  }, [])

  return (
    <ActivityContext.Provider
      value={{
        limit,
        maxPage,
        ongoing,
        past,
        fetchOngoingActivities,
        fetchOngoingState,
        fetchPastActivities,
        fetchPastState,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within a ActivityProvider')
  }
  return context
}
