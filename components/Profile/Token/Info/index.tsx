'use client'

import * as _ from 'lodash-es'
import { Stack } from '@mantine/core'
import MintFlow from './MintFlow'
import type { TUserToken } from '@/models/userToken'

type TokenInfoProps = {
  token?: TUserToken
  onClose: () => void
}

export default function TokenInfo(props: TokenInfoProps) {
  const { token, onClose } = props

  const minted = !!token

  return (
    <>
      <Stack gap="lg">{minted ? <>Update Token Icon</> : <MintFlow onClose={onClose} />}</Stack>
    </>
  )
}
