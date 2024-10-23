'use client'

import { usePathname } from '@/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getAirdrops } from '@/services/airdrop'
import type { TAirdrop } from '@/models/airdrop'

type DataPage = {
  total: number
  current: number
  limit: number
}

interface AirdropContextType {
  current: number
  total: number
  limit: number
  handlePageChange: (page: number) => void
  data: TAirdrop[]
  loading: boolean
  error?: Error
}

const AirdropContext = createContext<AirdropContextType | undefined>(undefined)

export const AirdropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only fetch data when on the airdrop page
  const pathname = usePathname()
  const isOnPage = pathname.startsWith('/wallet/airdrop')

  const [{ total, current, limit }, setPage] = useState<DataPage>({
    total: 1,
    current: 1,
    limit: 20,
  })

  const handlePageChange = (page: number) => {
    const newPage = page < 1 ? 1 : page > total ? total : page
    setPage(prev => ({
      ...prev,
      current: newPage,
    }))
  }

  const [airdropsState, fetchAirdrops] = useAsyncFn(async () => {
    const data = await getAirdrops({ page: current, limit })
    return data
  }, [current, limit])
  // Get data from the hook
  const { value, loading, error } = airdropsState

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

  // Fetch transactions when page changes
  useEffect(() => {
    if (isOnPage) {
      fetchAirdrops()
    }
  }, [current, isOnPage])

  return (
    <AirdropContext.Provider
      value={{
        current,
        total,
        limit,
        handlePageChange,
        data: value?.airdrops || [],
        loading,
        error,
      }}
    >
      {children}
    </AirdropContext.Provider>
  )
}

export const useAirdrop = (): AirdropContextType => {
  const context = useContext(AirdropContext)
  if (context === undefined) {
    throw new Error('useAirdrop must be used within an AirdropProvider')
  }
  return context
}
