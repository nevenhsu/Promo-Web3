'use client'

import { useEffect, useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import {
  getToken,
  getAdminPanel,
  getFeePool,
  getNftManager,
  getPaymentEscrow,
  getPointPool,
  getShareToken,
  getVault,
  type Contracts,
} from '@/contracts'

export default function useContracts() {
  const [contracts, setContracts] = useState<Contracts>()

  const { wallets } = useWallets()
  const [wallet] = wallets

  const getContracts = async () => {
    const provider = await wallet.getEthersProvider()
    const signer = await provider.getSigner()
    const token = getToken(signer)
    const adminPanel = getAdminPanel(signer)
    const vault = getVault(signer)
    const shareToken = getShareToken(signer)
    const nftManager = getNftManager(signer)
    const paymentEscrow = getPaymentEscrow(signer)
    const pointPool = getPointPool(signer)
    const feePool = getFeePool(signer)

    setContracts({
      token,
      adminPanel,
      vault,
      shareToken,
      nftManager,
      paymentEscrow,
      pointPool,
      feePool,
    })
  }

  useEffect(() => {
    if (wallet) {
      getContracts()
    }
  }, [wallet]) // assuming signer is a dependency

  return contracts
}
