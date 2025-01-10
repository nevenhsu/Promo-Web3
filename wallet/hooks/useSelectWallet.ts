'use client'

import { useAppDispatch } from '@/hooks/redux'
import { setWalletClientType } from '@/store/slices/wallet'

type ClientType = 'zerodev' | 'privy' | ''

export function useSelectWallet() {
  const dispatch = useAppDispatch()

  // type: 'zerodev' | 'privy' | ...
  const setClientType = (type: ClientType) => {
    dispatch(setWalletClientType(type))
  }

  return {
    setClientType,
  }
}
