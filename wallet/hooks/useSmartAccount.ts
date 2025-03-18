'use client'

// Get current state from Web3Context
// instead of using this hook directly

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth'
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
} from '@zerodev/sdk'
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator'
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants'
import { http } from 'viem'
import { getZeroDev } from '@/wallet/lib/zeroDev'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { toChainId } from '@/wallet/utils/network'
import type { Hash } from 'viem'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Signer } from '@zerodev/sdk/types'
import type { KernelClient } from '@/types/wallet'

const entryPoint = getEntryPoint('0.7')
const kernelVersion = KERNEL_V3_1

export function useSmartAccount() {
  const { wallets } = useWallets()
  const wallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const chainId = toChainId(wallet?.chainId)

  // Smart account values
  const [smartAccountAddress, setSmartAccountAddress] = useState<Hash>()
  const [kernelClient, setKernelClient] = useState<KernelClient>()
  const [loading, setLoading] = useState(true)

  const setupSmartAccount = async (wallet: ConnectedWallet, chainId: number) => {
    try {
      setLoading(true)
      // Reset smart account values
      setSmartAccountAddress(undefined)
      setKernelClient(undefined)

      const provider = (await wallet.getEthereumProvider()) as any
      const res = await getAccountClient(provider, chainId)

      if (!res || !res.kernelClient) {
        throw new Error('Smart account not created')
      }

      console.log('Privy wallet:', wallet.address)
      console.log('Smart account:', res.smartAccountAddress)

      const { smartAccountAddress } = res
      setSmartAccountAddress(smartAccountAddress)
      setKernelClient(res.kernelClient)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!wallet || !chainId) return

    // Use the Privy wallet to create a smart account
    setupSmartAccount(wallet, chainId)
  }, [wallet, chainId])

  return {
    smartAccountAddress,
    kernelClient,
    loading,
  }
}

async function getAccountClient(signer: Signer, chainId: number | undefined) {
  const zeroDev = getZeroDev(chainId)
  const publicClient = getPublicClient(chainId)

  // Check if the ZeroDev and public client are available
  if (!zeroDev || !chainId || !publicClient) return

  // Initialize a viem public client on your app's desired network
  const { chain } = publicClient

  // Create a ZeroDev ECDSA validator from the `smartAccountSigner` from above and your `publicClient`
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
    kernelVersion,
  })

  // Create a Kernel account from the ECDSA validator
  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
    kernelVersion,
  })

  const zerodevPaymaster = createZeroDevPaymasterClient({
    chain,
    transport: http(zeroDev.paymasterRpc),
  })

  // Construct a Kernel account client
  const kernelClient = createKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(zeroDev.bundlerRpc),
    // Required - the public client
    client: publicClient,
    paymaster: {
      getPaymasterData(userOperation) {
        return zerodevPaymaster.sponsorUserOperation({ userOperation })
      },
    },

    // Required - the default gas prices might be too high
    userOperation: {
      estimateFeesPerGas: async ({ bundlerClient }) => {
        return getUserOperationGasPrice(bundlerClient)
      },
    },
  })

  const smartAccountAddress = kernelClient.account.address

  return {
    smartAccountAddress,
    kernelClient,
  }
}
