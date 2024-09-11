'use client'

import { useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { usePrivy } from '@privy-io/react-auth'
import { useAppDispatch } from '@/hooks/redux'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { fetchUser, fetchUserStatus, clearData as clearUser } from '@/store/slices/user'
import { clearData as clearUserActivityStatus } from '@/store/slices/userActivityStatus'

// sync auth status between privy and next-auth

export function useSyncAuth() {
  const dispatch = useAppDispatch()

  const { nextAuthFail, nextAuth, privyAuthFail, bothAuth } = useLoginStatus()

  const { getAccessToken, user } = usePrivy()
  const { id: privyId } = user || {}

  const getAuthToken = async () => {
    const token = await getAccessToken()
    if (!token) throw new Error('no accessToken of privy')
    return token
  }

  const startAuth = async (privyId: string) => {
    const authToken = await getAuthToken()
    signIn('credentials', { authToken, privyId, redirect: false }).catch(err => {
      // TODO: handle error
      console.error(err)
    })
  }

  // auto fetch user data
  useEffect(() => {
    if (bothAuth) {
      dispatch(fetchUser())
      dispatch(fetchUserStatus())
    }
  }, [bothAuth])

  // go login
  useEffect(() => {
    if (privyId && nextAuthFail) {
      startAuth(privyId)
    }
  }, [privyId, nextAuthFail])

  // auto logout
  useEffect(() => {
    if (privyAuthFail && nextAuth) {
      dispatch(clearUser())
      dispatch(clearUserActivityStatus())
      signOut({ callbackUrl: '/' }) // NextAuth logout
    }
  }, [privyAuthFail, nextAuth])

  return null
}
