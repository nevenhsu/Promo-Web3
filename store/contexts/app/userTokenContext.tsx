'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { notifications } from '@mantine/notifications'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { getTokens, mintToken, updateToken } from '@/services/userTokens'
import type { TUserToken, UserToken } from '@/models/userToken'
import type { NewTokenValue, MintTokenValue } from '@/services/userTokens'
import type { AsyncState } from 'react-use/lib/useAsyncFn'

interface UserTokenContextType {
  fetchTokens: () => Promise<TUserToken[]>
  fetchState: AsyncState<TUserToken[]>
  updateTokenDoc: (data: NewTokenValue) => Promise<UserToken>
  updateState: AsyncState<UserToken>
  mint: (value: MintTokenValue) => Promise<void>
  mintState: AsyncState<void>
}

const UserTokenContext = createContext<UserTokenContextType | undefined>(undefined)

export const UserTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { nextAuth } = useLoginStatus() // Check if user is logged in

  const [fetchState, fetchTokens] = useAsyncFn(async () => {
    const { tokens } = await getTokens()

    return tokens
  }, [])

  const [updateState, updateTokenDoc] = useAsyncFn(async (data: NewTokenValue) => {
    const { token } = await updateToken(data)
    fetchTokens()

    notifications.show({
      title: 'Token updated',
      message: 'Your token has been updated successfully',
      color: 'green',
    })

    return token
  }, [])

  const [mintState, mint] = useAsyncFn(async (value: MintTokenValue) => {
    await mintToken(value)
    fetchTokens()

    notifications.show({
      title: 'Token minted',
      message: 'Your token has been minted successfully',
      color: 'green',
    })
  })

  useEffect(() => {
    if (nextAuth) {
      fetchTokens()
    }
  }, [nextAuth])

  return (
    <UserTokenContext.Provider
      value={{
        fetchTokens,
        fetchState,
        updateTokenDoc,
        updateState,
        mint,
        mintState,
      }}
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
