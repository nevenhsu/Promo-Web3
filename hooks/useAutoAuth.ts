'use client'

import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { usePrivy } from '@privy-io/react-auth'
import { fetchUser } from '@/store/slices/user'
import { useAppDispatch } from '@/hooks/redux'

// auto connect privy to mongodb

export default function useAutoAuth() {
  const dispatch = useAppDispatch()

  const { getAccessToken, user } = usePrivy()
  const { id: privyId } = user || {}

  const { status } = useSession()
  const authOnServer = status === 'authenticated'
  const notAuthOnServer = status === 'unauthenticated'

  const getAuthToken = async () => {
    const token = await getAccessToken()
    if (!token) throw new Error('no accessToken of privy')
    return token
  }

  const startAuth = async (privyId: string) => {
    const authToken = await getAuthToken()
    signIn('credentials', { authToken, privyId, redirect: false }).catch(err => console.error(err))
  }

  // go auth on server
  useEffect(() => {
    if (privyId && notAuthOnServer) {
      startAuth(privyId)
    }
  }, [privyId, notAuthOnServer])

  // auto fetch user data
  useEffect(() => {
    if (authOnServer) {
      dispatch(fetchUser())
    }
  }, [authOnServer])

  return null
}
