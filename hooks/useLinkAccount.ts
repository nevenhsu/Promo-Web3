'use client'

import { useEffect, useMemo } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { updateLinkAccount, deleteLinkAccount } from '@/store/slices/user'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { LinkAccountPlatform } from '@/types/db'
import { useLoginStatus } from '@/hooks/useLoginStatus'

// auto update link accounts

export default function useLinkAccount() {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(state => state.user)
  const { bothAuth } = useLoginStatus()
  const { user } = usePrivy()
  const { google, twitter } = user || {}

  const { linkedAccounts = [] } = data
  const linkedGoogle = useMemo(
    () => linkedAccounts.find(account => account.platform === LinkAccountPlatform.Google),
    [linkedAccounts]
  )
  const linkedX = useMemo(
    () => linkedAccounts.find(account => account.platform === LinkAccountPlatform.X),
    [linkedAccounts]
  )

  // auto update google account
  useEffect(() => {
    if (!bothAuth) return

    const notLinked = google && !linkedGoogle
    const outDated = google && linkedGoogle && google.subject !== linkedGoogle.userId

    if (notLinked || outDated) {
      dispatch(
        updateLinkAccount({
          userId: google.subject,
          platform: LinkAccountPlatform.Google,
          username: google.name || '',
        })
      )
    } else if (!google && linkedGoogle) {
      dispatch(deleteLinkAccount(LinkAccountPlatform.Google))
    }
  }, [bothAuth, linkedGoogle, google])

  // auto update x account
  useEffect(() => {
    if (!bothAuth) return

    const notLinked = twitter && !linkedX
    const outDated = twitter && linkedX && twitter.subject !== linkedX.userId
    const outDatedName =
      twitter && linkedX && twitter.username && `@${twitter.username}` !== linkedX.username

    if (notLinked || outDated || outDatedName) {
      const username = twitter.username ? `@${twitter.username}` : twitter.name || ''
      dispatch(
        updateLinkAccount({
          userId: twitter.subject,
          platform: LinkAccountPlatform.X,
          username,
        })
      )
    } else if (!twitter && linkedX) {
      dispatch(deleteLinkAccount(LinkAccountPlatform.X))
    }
  }, [bothAuth, linkedX, twitter])

  return null
}
