'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import {
  getActivities,
  createActivity as _createActivity,
  updateActivity as _updateActivity,
} from '@/services/private/activity'
import type { TActivity, ActivityData } from '@/models/activity'

type DataPage = {
  total: number
  current: number
  limit: number
}

interface ActivityContextType {
  current: number
  total: number
  limit: number
  data: TActivity[]
  loading: boolean
  error?: Error
  selectedId: string | undefined
  selectedActivity: TActivity | undefined
  setSelectedId: (id: string) => void
  fetchActivities: () => void
  createActivity: (newData: ActivityData) => Promise<TActivity | undefined>
  updateActivity: (id: string, updateData: Partial<ActivityData>) => Promise<TActivity | undefined>
  handlePageChange: (page: number) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ total, current, limit }, setPage] = useState<DataPage>({
    total: 1,
    current: 1,
    limit: 10,
  })

  const [selectedId, setSelectedId] = useState<string>()

  const handlePageChange = (page: number) => {
    const newPage = page < 1 ? 1 : page > total ? total : page
    setPage(prev => ({ ...prev, current: newPage }))
  }

  const [activityState, fetchActivities] = useAsyncFn(async () => {
    const data = await getActivities({ page: current, limit })
    return data
  }, [current, limit])
  const { value } = activityState

  const selectedActivity = useMemo(() => {
    return value?.activities.find(o => o._id === selectedId)
  }, [selectedId, value])

  const [createActivityState, createActivity] = useAsyncFn(
    async (newData: ActivityData) => {
      const activity = await _createActivity(newData)
      if (activity) {
        if (current === 1) {
          fetchActivities()
        } else {
          setPage(prev => ({ ...prev, current: 1 }))
        }
        return activity
      }
    },
    [current, limit]
  )

  const [updateActivityState, updateActivity] = useAsyncFn(
    async (_id: string, updateData: Partial<ActivityData>) => {
      const updated = await _updateActivity(_id, updateData)
      if (updated) {
        fetchActivities()
        return updated
      }
    }
  )

  const loading =
    activityState.loading || createActivityState.loading || updateActivityState.loading

  // Fetch transactions when page changes
  useEffect(() => {
    fetchActivities()
  }, [current])

  // Update page data when data are fetched
  useEffect(() => {
    if (value) {
      if (value.total) {
        const totalPage = Math.ceil(value.total / value.limit)
        setPage(prev => ({
          ...prev,
          total: totalPage,
          limit: value.limit,
        }))
      } else {
        setPage(prev => ({
          ...prev,
          limit: value.limit,
        }))
      }
    }
  }, [value])

  return (
    <ActivityContext.Provider
      value={{
        total,
        current,
        limit,
        data: value?.activities || [],
        selectedId,
        selectedActivity,
        loading,
        setSelectedId,
        fetchActivities,
        createActivity,
        updateActivity,
        handlePageChange,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}
