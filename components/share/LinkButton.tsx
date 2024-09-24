'use client'

import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { Button } from '@mantine/core'
import { toUpper } from '@/utils/helper'
import { PiCheckBold } from 'react-icons/pi'

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
    <Button
      variant="outline"
      color={account ? 'dark' : ''}
      loading={linking}
      onClick={onLink}
      leftSection={<PiCheckBold size={14} />}
    >
      {account ? `Linked as ${account.username}` : `Link your ${toUpper(platform)}`}
    </Button>
  )
}
