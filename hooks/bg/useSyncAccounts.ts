'use client'

import { useEffect, useMemo } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { updateLinkAccount, deleteLinkAccount, updateUser } from '@/store/slices/user'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { LinkAccountPlatform } from '@/types/db'
import { useLoginStatus } from '@/hooks/useLoginStatus'

// auto update link accounts

export function useSyncAccounts() {
  const dispatch = useAppDispatch()
  const { data, fetched } = useAppSelector(state => state.user)
  const { bothAuth } = useLoginStatus()
  const { user } = usePrivy()
  const { google, twitter, email } = user || {}

  const ready = fetched && bothAuth && user

  const { linkedAccounts = [], email: linkedEmail } = data
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
    if (!ready) return

    const notLinked = google && !linkedGoogle
    const outDated = google && linkedGoogle && google.subject !== linkedGoogle.subject

    if (notLinked || outDated) {
      dispatch(
        updateLinkAccount({
          subject: google.subject,
          platform: LinkAccountPlatform.Google,
          username: google.name || '',
        })
      )
    } else if (!google && linkedGoogle) {
      dispatch(deleteLinkAccount(LinkAccountPlatform.Google))
    }
  }, [ready, linkedGoogle, google])

  // auto update x account
  useEffect(() => {
    if (!ready) return

    const notLinked = twitter && !linkedX
    const outDated = twitter && linkedX && twitter.subject !== linkedX.subject

    if (notLinked || outDated) {
      dispatch(
        updateLinkAccount({
          subject: twitter.subject,
          userId: twitter.subject,
          platform: LinkAccountPlatform.X,
          username: twitter.username || '',
        })
      )
    } else if (!twitter && linkedX) {
      dispatch(deleteLinkAccount(LinkAccountPlatform.X))
    }
  }, [ready, linkedX, twitter])

  // auto update email
  useEffect(() => {
    if (!ready) return

    const notLinked = email && !linkedEmail
    const outDated = email && linkedEmail && email.address !== linkedEmail

    if (notLinked || outDated) {
      dispatch(
        updateUser({
          email: email.address,
        })
      )
    }
  }, [ready, linkedEmail, email])

  return null
}
