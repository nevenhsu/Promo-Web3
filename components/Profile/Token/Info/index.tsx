'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { Stack } from '@mantine/core'
import MintFlow from './MintFlow'
import type { TUserToken } from '@/models/userToken'

type TokenInfoProps = {
  token?: TUserToken
}

export default function TokenInfo(props: TokenInfoProps) {
  const { token } = props

  return (
    <>
      <Stack gap="lg">
        <MintFlow />
      </Stack>
    </>
  )
}
