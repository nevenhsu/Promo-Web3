'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn, usePrevious } from 'react-use'
import { getPublicActivities } from '@/services/activity'
import type { TPublicActivity } from '@/models/activity'

export enum TabValue {
  New = 'new',
  Ended = 'ended',
}

type DataPage = {
  total: number
  current: number
  limit: number
}

type Pages = { [key in TabValue]: DataPage }

interface ActivityContextType {
  current: number
  total: number
  limit: number
  activeTab: TabValue
  setActiveTab: (tab: TabValue) => void
  handlePageChange: (page: number) => void
  data: TPublicActivity[]
  loading: boolean
  error?: Error
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(TabValue.New)
  const prevTab = usePrevious(activeTab)

  const [pages, setPages] = useState<Pages>({
    new: { total: 1, current: 1, limit: 10 },
    ended: { total: 1, current: 1, limit: 10 },
  })
  const activePage = pages[activeTab]
  const { total, limit } = activePage
  const current = activeTab === prevTab ? activePage.current : 1

  const handlePageChange = (page: number) => {
    const newPage = page < 1 ? 1 : page > total ? total : page
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: newPage },
    }))
  }

  const [activityState, fetchActivities] = useAsyncFn(async () => {
    const ongoing = activeTab === TabValue.New
    const data = await getPublicActivities({ page: current, limit, ongoing })
    return data
  }, [current, limit, activeTab])
  // Get data from the hook
  const { value, loading, error } = activityState

  // Update page data when transactions are fetched
  useEffect(() => {
    if (value) {
      if (value.total) {
        const totalPage = Math.ceil(value.total / value.limit)
        setPages(prev => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], total: totalPage, limit: value.limit },
        }))
      } else {
        setPages(prev => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], limit: value.limit },
        }))
      }
    }
  }, [value, activeTab])

  // Fetch transactions when page changes
  useEffect(() => {
    fetchActivities()
  }, [current, activeTab])

  return (
    <ActivityContext.Provider
      value={{
        current,
        total,
        limit,
        activeTab,
        setActiveTab,
        handlePageChange,
        loading,
        data: value?.activities || [],
        error,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useReferral must be used within an ActivityProvider')
  }
  return context
}
