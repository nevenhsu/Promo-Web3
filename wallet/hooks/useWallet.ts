'use client'

import { useWallets } from '@privy-io/react-auth'

export function useWallet() {
  const { wallets } = useWallets()
  const wallet = wallets.find(wallet => wallet.walletClientType === 'privy')

  return wallet
}
