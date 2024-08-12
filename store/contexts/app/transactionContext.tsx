'use client'

import { usePathname } from '@/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn, usePrevious } from 'react-use'
import { getTransactions } from '@/services/transaction'
import type { TTransaction } from '@/models/transaction'

export enum TabValue {
  Transaction = 'transaction',
  Airdrop = 'airdrop',
}

type DataPage = {
  total: number
  current: number
  limit: number
}

type Pages = { [key in TabValue]: DataPage }

interface TransactionContextType {
  current: number
  total: number
  limit: number
  activeTab: TabValue
  setActiveTab: (tab: TabValue) => void
  handlePageChange: (page: number) => void
  data: TTransaction[]
  loading: boolean
  error?: Error
}

const TxContext = createContext<TransactionContextType | undefined>(undefined)

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only fetch data when on the history page
  const pathname = usePathname()
  const isOnPage = pathname.startsWith('/wallet/history')

  const [activeTab, setActiveTab] = useState(TabValue.Transaction)
  const prevTab = usePrevious(activeTab)

  const [pages, setPages] = useState<Pages>({
    transaction: { total: 1, current: 1, limit: 10 },
    airdrop: { total: 1, current: 1, limit: 10 },
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

  const [transactionState, fetchTransactions] = useAsyncFn(async () => {
    const isAirdrop = activeTab === TabValue.Airdrop
    const data = await getTransactions({ page: current, limit, isAirdrop })
    return data
  }, [current, limit, activeTab])
  // Get data from the hook
  const { value, loading, error } = transactionState

  // Update page data when data are fetched
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
    if (isOnPage) {
      fetchTransactions()
    }
  }, [current, activeTab, isOnPage])

  // Reset current page when tab changes
  useEffect(() => {
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: 1 },
    }))
  }, [activeTab])

  return (
    <TxContext.Provider
      value={{
        current,
        total,
        limit,
        activeTab,
        setActiveTab,
        handlePageChange,
        data: value?.txs || [],
        loading,
        error,
      }}
    >
      {children}
    </TxContext.Provider>
  )
}

export const useTransaction = () => {
  const context = useContext(TxContext)
  if (!context) {
    throw new Error('useTx must be used within a TransactionProvider')
  }
  return context
}
