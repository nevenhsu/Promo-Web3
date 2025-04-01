'use client'

import { usePathname } from '@/i18n/routing'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useWeb3 } from '@/wallet/Web3Context'
import { getCreatorActivity } from '@/services/activity'
import type { TActivity } from '@/models/activity'

type DataPage = {
  total: number
  current: number
  limit: number
}

interface CreatorActivityContextType {
  current: number
  total: number
  limit: number
  handlePageChange: (page: number) => void
  data: TActivity[]
  loading: boolean
  error?: Error
}

const ActivityContext = createContext<CreatorActivityContextType | undefined>(undefined)

export const CreatorActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { nextAuth } = useLoginStatus() // Check if user is logged in
  const { chainId } = useWeb3() // Get the current chain ID

  // Only fetch data when on the activity page
  const pathname = usePathname()
  const isOnPage = pathname.startsWith('/profile/activity')

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

  const [activityState, fetchActivities] = useAsyncFn(async () => {
    if (!nextAuth || !chainId) return
    const data = await getCreatorActivity({ page: current, limit, chainId })
    return data
  }, [current, limit, nextAuth, chainId])
  // Get data from the hook
  const { value, loading, error } = activityState

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
    if (isOnPage && nextAuth && chainId) {
      fetchActivities()
    }
  }, [current, isOnPage, nextAuth, chainId])

  return (
    <ActivityContext.Provider
      value={{
        current,
        total,
        limit,
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

export const useCreatorActivity = (): CreatorActivityContextType => {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useCreatorActivity must be used within an CreatorActivityProvider')
  }
  return context
}
