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
import { KernelEIP1193Provider } from '@zerodev/sdk/providers'
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants'
import { http } from 'viem'
import { getZeroDev } from '@/wallet/lib/zeroDev'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { getWalletClient } from '@/wallet/lib/getWalletClient'
import { toChainId } from '@/wallet/utils/network'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Hash, EIP1193Provider } from 'viem'
import type { KernelProvider, KernelClient, WalletClient } from '@/types/wallet'

export type Kernel = {
  provider: KernelProvider
  kernelClient: KernelClient
  walletClient: WalletClient
}

const entryPoint = getEntryPoint('0.7')
const kernelVersion = KERNEL_V3_1

export function useSmartAccount() {
  const { wallets } = useWallets()
  const wallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const chainId = toChainId(wallet?.chainId)

  // Smart account values
  const [smartAccountAddress, setSmartAccountAddress] = useState<Hash>()
  const [kernel, setKernel] = useState<Kernel>()
  const [loading, setLoading] = useState(true)

  const setupSmartAccount = async (privyWallet: ConnectedWallet, chainId: number) => {
    try {
      setLoading(true)
      // Reset smart account values
      setSmartAccountAddress(undefined)
      setKernel(undefined)

      const res = await getAccountClient(privyWallet, chainId)

      if (!res || !res.walletClient) {
        throw new Error('Smart account not created')
      }

      console.log('Smart account:', res.smartAccountAddress)

      const { smartAccountAddress } = res
      setSmartAccountAddress(smartAccountAddress)
      setKernel({
        provider: res.kernelProvider,
        walletClient: res.walletClient,
        kernelClient: res.kernelClient,
      })
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
    kernel,
    loading,
  }
}

async function getAccountClient(wallet: ConnectedWallet, chainId: number | undefined) {
  const zeroDev = getZeroDev(chainId)
  const publicClient = getPublicClient(chainId)

  // Check if the ZeroDev and public client are available
  if (!zeroDev || !chainId || !publicClient) return

  // Get the EIP1193 provider from Privy
  const provider = (await wallet.getEthereumProvider()) as EIP1193Provider

  // Initialize a viem public client on your app's desired network
  const { chain } = publicClient

  // Create a ZeroDev ECDSA validator from the `smartAccountSigner` from above and your `publicClient`
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: provider,
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

  const kernelProvider = new KernelEIP1193Provider(kernelClient)

  const walletClient = getWalletClient(chainId, kernelProvider, smartAccountAddress)

  return {
    smartAccountAddress,
    kernelProvider,
    kernelClient,
    walletClient,
  }
}
