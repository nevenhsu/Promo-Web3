'use client'

import { usePathname } from '@/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getActivityStatuses } from '@/services/activityStatus'
import type { TUserActivityStatusData } from '@/models/userActivityStatus'

type DataPage = {
  total: number
  current: number
  limit: number
}

interface ActivityStatusContextType {
  current: number
  total: number
  limit: number
  handlePageChange: (page: number) => void
  data: TUserActivityStatusData[]
  loading: boolean
  error?: Error
}

const ActivityStatusContext = createContext<ActivityStatusContextType | undefined>(undefined)

export const ActivityStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only fetch data when on the record page
  const pathname = usePathname()
  const isOnPage = pathname.startsWith('/record')

  // State for pagination
  const [pageData, setPageData] = useState<DataPage>({ total: 1, current: 1, limit: 10 })
  const { total, limit, current } = pageData

  const handlePageChange = (page: number) => {
    const newPage = page < 1 ? 1 : page > total ? total : page
    setPageData(prev => ({
      ...prev,
      current: newPage,
    }))
  }

  const [activityStatusesState, fetchActivityStatuses] = useAsyncFn(async () => {
    const data = await getActivityStatuses({
      page: current,
      limit,
    })
    return data
  }, [current, limit])
  // Get data from the hook
  const { value, loading, error } = activityStatusesState

  // Update page data when data are fetched
  useEffect(() => {
    if (value) {
      if (value.total) {
        const totalPage = Math.ceil(value.total / value.limit)
        setPageData(prev => ({ ...prev, total: totalPage, limit: value.limit }))
      } else {
        setPageData(prev => ({ ...prev, limit: value.limit }))
      }
    }
  }, [value])

  useEffect(() => {
    if (isOnPage) {
      fetchActivityStatuses()
    }
  }, [current, isOnPage])

  return (
    <ActivityStatusContext.Provider
      value={{
        current,
        total,
        limit,
        handlePageChange,
        data: value?.data || [],
        loading,
        error,
      }}
    >
      {children}
    </ActivityStatusContext.Provider>
  )
}

export const useActivityStatus = () => {
  const context = useContext(ActivityStatusContext)

  if (!context) {
    throw new Error('useActivityStatus must be used within an ActivityStatusProvider')
  }

  return context
}
