'use client'

import { usePathname } from '@/i18n/routing'
import React, { createContext, useContext, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getUserToken, updateUserToken, type UserTokenData } from '@/services/userTokens'
import type { UserToken } from '@/models/userToken'
import type { Token } from '@/models/token'

interface UserTokenContextType {
  data?: { userToken?: UserToken; tokens: Token[] }
  loading: boolean
  error?: Error
  updateToken: (data: UserTokenData) => Promise<void>
}

const UserTokenContext = createContext<UserTokenContextType | undefined>(undefined)

export const UserTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const isOnPage = pathname.startsWith(`/u`) || pathname.startsWith(`/profile`)

  const [state, fetchUserToken] = useAsyncFn(async () => {
    const data = await getUserToken()
    return data
  }, [])

  const [updateState, updateToken] = useAsyncFn(async (data: UserTokenData) => {
    await updateUserToken(data)
    fetchUserToken()
  }, [])

  const loading = state.loading || updateState.loading

  useEffect(() => {
    if (isOnPage) {
      fetchUserToken()
    }
  }, [isOnPage])

  return (
    <UserTokenContext.Provider
      value={{ data: state.value, loading, error: updateState.error, updateToken }}
    >
      {children}
    </UserTokenContext.Provider>
  )
}

export function useUserToken() {
  const context = useContext(UserTokenContext)
  if (!context) {
    throw new Error('useUserToken must be used within a UserTokenProvider')
  }
  return context
}
