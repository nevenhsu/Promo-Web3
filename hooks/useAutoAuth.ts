'use client'

import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { usePrivy } from '@privy-io/react-auth'
import { fetchUser } from '@/store/slices/user'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'

// auto connect privy to mongodb

export default function useAutoAuth() {
  const dispatch = useAppDispatch()
  const { getAccessToken, user } = usePrivy()
  const privyId = user?.id

  const { fetched, _id } = useAppSelector(state => state.user)
  const notAuthOnServer = fetched && !_id

  const getAuthToken = async () => {
    const token = await getAccessToken()
    if (!token) throw new Error('no accessToken of privy')
    return token
  }

  const startAuth = async (privyId: string) => {
    const authToken = await getAuthToken()
    signIn('credentials', { authToken, privyId, redirect: false })
      .then(res => {
        if (res?.error) {
          console.error(res.error)
        } else {
          dispatch(fetchUser())
        }
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    if (privyId && notAuthOnServer) {
      startAuth(privyId) // go auth on server
    }
  }, [privyId, notAuthOnServer])

  // on init
  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  return null
}
