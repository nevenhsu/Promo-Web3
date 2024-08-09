'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import {
  getReferrer,
  getReferralByLevel,
  createReferral as _createReferral,
} from '@/services/referral'
import { ReferralLevel, type PublicUser } from '@/types/db'
import type { TReferee } from '@/models/referral'
import type { AsyncState } from 'react-use/lib/useAsyncFn'

interface ReferralContextType {
  referer: PublicUser | undefined
  isReferred: boolean
  referees1st: TReferee[]
  referees2nd: TReferee[]
  createReferral: (username: string) => Promise<void>
  createState: AsyncState<void>
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined)

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bothAuth } = useLoginStatus()

  const [referer, setReferer] = useState<PublicUser>()
  const isReferred = Boolean(referer)

  const [referees1st, setReferees1st] = useState<TReferee[]>([])
  const [referees2nd, setReferees2nd] = useState<TReferee[]>([])

  const fetchReferer = async () => {
    try {
      const data = await getReferrer()
      if (data) {
        setReferer(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const [createState, createReferral] = useAsyncFn(
    async (username: string) => {
      if (isReferred) return
      if (username) {
        const data = await _createReferral(username)
        if (data) {
          setReferer(data)
        }
      }
    },
    [isReferred]
  )

  useEffect(() => {
    if (bothAuth) {
      fetchReferer()
    }
  }, [bothAuth])

  return (
    <ReferralContext.Provider
      value={{
        referer,
        isReferred,
        referees1st,
        referees2nd,
        createReferral,
        createState,
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
