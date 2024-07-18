'use client'

import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { usePrivy } from '@privy-io/react-auth'
import { fetchUser } from '@/store/slices/user'
import { useAppDispatch } from '@/hooks/redux'

// auto connect privy to mongodb

export default function useAutoAuth() {
  const dispatch = useAppDispatch()

  const { status } = useSession()
  const { getAccessToken, user } = usePrivy()
  const privyId = user?.id

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

  useEffect(() => {
    if (privyId && notAuthOnServer) {
      startAuth(privyId) // go auth on server
    }
  }, [privyId, notAuthOnServer])

  // on init
  useEffect(() => {
    if (authOnServer) {
      dispatch(fetchUser())
    }
  }, [authOnServer])

  return null
}
