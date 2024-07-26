'use client'

import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { usePrivy } from '@privy-io/react-auth'
import { fetchUser, fetchUserStatus } from '@/store/slices/user'
import { useAppDispatch } from '@/hooks/redux'
import { useLoginStatus } from '@/hooks/useLoginStatus'

// auto connect privy to mongodb

export default function useAutoAuth() {
  const dispatch = useAppDispatch()

  const { nextAuthFail, nextAuth } = useLoginStatus()

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

  // go auth on server
  useEffect(() => {
    if (privyId && nextAuthFail) {
      startAuth(privyId)
    }
  }, [privyId, nextAuthFail])

  // auto fetch user data
  useEffect(() => {
    if (nextAuth) {
      dispatch(fetchUser())
      dispatch(fetchUserStatus())
    }
  }, [nextAuth])

  return null
}
