'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { notifications } from '@mantine/notifications'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { getUserTokens, updateUserToken, checkUserToken, mintToken } from '@/services/userTokens'
import type { TUserToken } from '@/models/userToken'
import type { UserTokenData } from '@/services/userTokens'

interface UserTokenContextType {
  data?: { tokens: TUserToken[] }
  loading: boolean
  error?: Error
  updateToken: (data: UserTokenData) => Promise<void>
  mint: (chainId: number) => Promise<void>
}

const UserTokenContext = createContext<UserTokenContextType | undefined>(undefined)

export const UserTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bothAuth } = useLoginStatus() // Check if user is logged in

  const [state, fetchUserToken] = useAsyncFn(async () => {
    const data = await getUserTokens()
    return data
  }, [])

  const [updateState, updateToken] = useAsyncFn(async (data: UserTokenData) => {
    await checkUserToken(data.name, data.symbol)

    await updateUserToken(data)
    fetchUserToken()

    notifications.show({
      title: 'Token updated',
      message: 'Your token has been updated successfully',
      color: 'green',
    })
  }, [])

  const [mintState, mint] = useAsyncFn(async (chainId: number) => {
    await mintToken(chainId)
    fetchUserToken()

    notifications.show({
      title: 'Token minting',
      message: 'It may take a few hours to mint your token',
      color: 'blue',
    })
  })

  const loading = state.loading || updateState.loading || mintState.loading
  const error = state.error || updateState.error

  useEffect(() => {
    if (bothAuth) {
      fetchUserToken()
    }
  }, [bothAuth])

  // Show mint error
  useEffect(() => {
    if (mintState.error) {
      notifications.show({
        title: 'Mint error',
        message:
          mintState.error.response?.data.error ||
          mintState.error.message ||
          'An error occurred while minting token',
        color: 'red',
      })
    }
  }, [mintState.error])

  // Show notification when token is minted
  useEffect(() => {
    if (!processing && prevProcessing) {
      notifications.show({
        title: 'Token minted',
        message: 'Your token has been minted successfully',
        color: 'green',
      })
    }
  }, [processing, prevProcessing])

  return (
    <UserTokenContext.Provider value={{ data: state.value, loading, error, updateToken, mint }}>
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
