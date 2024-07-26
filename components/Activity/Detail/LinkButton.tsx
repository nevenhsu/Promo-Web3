'use client'

import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { Button } from '@mantine/core'
import { toUpper } from '@/utils/helper'

type LinkButtonProps = {
  platform: string
  onLink: () => void
}

export default function LinkButton({ platform, onLink }: LinkButtonProps) {
  // Platform linked account from database
  const { data: userData, linking } = useAppSelector(state => state.user)
  const { linkedAccounts } = userData
  const account = useMemo(() => {
    if (!linkedAccounts || !platform) return
    return linkedAccounts.find(o => o.platform === platform)
  }, [linkedAccounts, platform])

  return (
    <Button onClick={onLink} loading={linking}>
      {account ? `Linked as ${account.username}` : `Link your ${toUpper(platform)}`}
    </Button>
  )
}
