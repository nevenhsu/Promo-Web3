'use client'

import { usePathname } from '@/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import {
  getReferrer,
  getReferralByLevel,
  createReferral as _createReferral,
  getReferralCount,
} from '@/services/referral'
import { ReferralLevel, type PublicUser } from '@/types/db'
import type { TReferee } from '@/models/referral'
import type { AsyncState } from 'react-use/lib/useAsyncFn'

export enum TabValue {
  Lv1 = 'lv1',
  Lv2 = 'lv2',
}

type DataPage = {
  total: number
  current: number
  limit: number
}

interface ReferralContextType {
  referer: PublicUser | undefined
  isReferred: boolean
  createReferral: (username: string) => Promise<PublicUser | undefined>
  createReferralState: AsyncState<PublicUser | undefined>
  // Pagination
  activeTab: TabValue
  setActiveTab: (tab: TabValue) => void
  handlePageChange: (page: number) => void
  pages: { [key in TabValue]: DataPage }
  // Referral list
  lv1State: AsyncState<TReferee[]>
  lv2State: AsyncState<TReferee[]>
  referralCountState: AsyncState<{ lv1: number; lv2: number }>
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined)

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bothAuth } = useLoginStatus() // Check if user is logged in

  // Referral state
  const [isReferred, setIsReferred] = useState(false)

  // only on list page
  const pathname = usePathname()
  const isOnListPage = pathname === '/refer/list'

  // Pagination
  const [activeTab, setActiveTab] = useState(TabValue.Lv1)
  const [pages, setPages] = useState<{ [key in TabValue]: DataPage }>({
    lv1: { total: 1, current: 1, limit: 10 },
    lv2: { total: 1, current: 1, limit: 10 },
  })
  const { lv1, lv2 } = pages

  const handlePageChange = (page: number) => {
    const activePage = activeTab === TabValue.Lv1 ? lv1 : lv2
    const { total } = activePage
    const newPage = page < 1 ? 1 : page > total ? total : page
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: newPage },
    }))
  }

  // Fetch referral count
  const [referralCountState, fetchReferralCount] = useAsyncFn(async () => {
    const data = await getReferralCount()
    return data
  }, [])

  // Fetch referrals
  const [lv1State, fetchLv1] = useAsyncFn(async () => {
    const data = await getReferralByLevel({
      level: ReferralLevel.First,
      page: lv1.current,
      limit: lv1.limit,
    })

    if (lv1.limit !== data.limit) {
      setPages(prev => ({
        ...prev,
        lv1: { ...prev.lv1, limit: data.limit },
      }))
    }

    return data.referrals
  }, [lv1])

  const [lv2State, fetchLv2] = useAsyncFn(async () => {
    const data = await getReferralByLevel({
      level: ReferralLevel.Second,
      page: lv2.current,
      limit: lv2.limit,
    })

    if (lv2.limit !== data.limit) {
      setPages(prev => ({
        ...prev,
        lv2: { ...prev.lv2, limit: data.limit },
      }))
    }

    return data.referrals
  }, [lv2])

  // Fetch referrer
  const [refererState, fetchReferer] = useAsyncFn(async () => {
    const data = await getReferrer()
    if (data) {
      setIsReferred(true)
    }
    return data
  }, [])

  // Create referral
  const [createReferralState, createReferral] = useAsyncFn(
    async (username: string) => {
      if (isReferred) return undefined

      if (username) {
        const data = await _createReferral(username)
        setIsReferred(true)
        return data
      }
    },
    [isReferred]
  )

  // Get referer
  const referer = refererState.value || createReferralState.value

  useEffect(() => {
    if (bothAuth) {
      fetchReferer()
    }
  }, [bothAuth])

  // Fetch referral count
  useEffect(() => {
    if (bothAuth && isOnListPage) {
      fetchReferralCount()
    }
  }, [bothAuth, isOnListPage])

  // Fetch referrals lv1
  useEffect(() => {
    if (bothAuth && isOnListPage) {
      fetchLv1()
    }
  }, [bothAuth, isOnListPage, lv1.current])

  // Fetch referrals lv2
  useEffect(() => {
    if (bothAuth && isOnListPage) {
      fetchLv2()
    }
  }, [bothAuth, isOnListPage, lv2.current])

  // Count total pages
  useEffect(() => {
    if (referralCountState.value) {
      const counts = referralCountState.value
      setPages(prev => ({
        ...prev,
        lv1: { ...prev.lv1, total: Math.ceil(counts.lv1 / lv1.limit) || 1 },
        lv2: { ...prev.lv2, total: Math.ceil(counts.lv2 / lv2.limit) || 1 },
      }))
    }
  }, [referralCountState.value, lv1.limit, lv2.limit])

  return (
    <ReferralContext.Provider
      value={{
        referer,
        isReferred,
        createReferral,
        createReferralState,
        activeTab,
        setActiveTab,
        handlePageChange,
        pages,
        lv1State,
        lv2State,
        referralCountState,
      }}
    >
      {children}
    </ReferralContext.Provider>
  )
}

export const useReferral = (): ReferralContextType => {
  const context = useContext(ReferralContext)
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider')
  }
  return context
}
