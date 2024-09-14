'use client'

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { providerToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import {
  createZeroDevPaymasterClient,
  createKernelAccount,
  createKernelAccountClient,
} from '@zerodev/sdk'
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator'
import { KernelEIP1193Provider } from '@zerodev/sdk/providers'
import { KERNEL_V3_1 } from '@zerodev/sdk/constants'
import { http } from 'viem'
import { getZeroDev, type ZeroDev } from '@/wallet/lib/zeroDev'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { getWalletClient } from '@/wallet/lib/getWalletClient'
import { toChainId } from '@/wallet/utils/network'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Hash, Chain } from 'viem'
import type { KernelAccount, KernelProvider, KernelClient, WalletClient } from '@/types/wallet'

// Get current wallet values from Web3Context
// instead of using this hook directly

export type Kernel = {
  provider: KernelProvider
  kernelClient: KernelClient
  walletClient: WalletClient
}

const kernelVersion = KERNEL_V3_1

export function useSmartAccount() {
  const { wallets } = useWallets()
  const wallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const chainId = toChainId(wallet?.chainId)

  // Smart account values
  const [smartAccount, setSmartAccount] = useState<KernelAccount>()
  const [smartAccountAddress, setSmartAccountAddress] = useState<Hash>()
  const [withSponsor, setWithSponsor] = useState<Kernel>()
  const [noSponsor, setNoSponsor] = useState<Kernel>()
  const [loading, setLoading] = useState(true)

  const setupSmartAccount = async (privyWallet: ConnectedWallet, chainId: number) => {
    try {
      setLoading(true)
      // Reset smart account values
      setSmartAccount(undefined)
      setSmartAccountAddress(undefined)
      setWithSponsor(undefined)
      setNoSponsor(undefined)

      const res = await getAccountClient(privyWallet, chainId)

      if (!res?.smartAccountAddress) {
        throw new Error('Smart account not created')
      }

      console.log('Smart account created:', res.smartAccountAddress)

      const { smartAccount, smartAccountAddress, withSponsor, noSponsor } = res
      setSmartAccount(smartAccount)
      setSmartAccountAddress(smartAccountAddress)
      setWithSponsor(withSponsor)
      setNoSponsor(noSponsor)
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
    smartAccount,
    smartAccountAddress,
    withSponsor,
    noSponsor,
    loading,
  }
}

async function getAccountClient(wallet: ConnectedWallet, chainId: number | undefined) {
  const zeroDev = getZeroDev(chainId)
  const publicClient = getPublicClient(chainId)

  // Check if the ZeroDev and public client are available
  if (!zeroDev || !chainId || !publicClient) return

  // Get the EIP1193 provider from Privy
  const provider = await wallet.getEthereumProvider()

  // Use the EIP1193 `provider` from Privy to create a `SmartAccountSigner`
  const smartAccountSigner = await providerToSmartAccountSigner(provider as any)

  // Initialize a viem public client on your app's desired network
  const { chain } = publicClient

  // Create a ZeroDev ECDSA validator from the `smartAccountSigner` from above and your `publicClient`
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: smartAccountSigner,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    kernelVersion,
  })

  // Create a Kernel account from the ECDSA validator
  const smartAccount = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    kernelVersion,
  })

  // Create a Kernel account client to send user operations from the smart account
  const smartAccountAddress = smartAccount.address
  // kernel client
  const withSponsor = createAccountClient(smartAccount, chain, zeroDev, true)
  const noSponsor = createAccountClient(smartAccount, chain, zeroDev, false)

  // provider
  const providerWithSponsor = new KernelEIP1193Provider(withSponsor)
  const providerNoSponsor = new KernelEIP1193Provider(noSponsor)

  // wallet client
  const walletClientWithSponsor = getWalletClient(chainId, providerWithSponsor, smartAccountAddress)
  const walletClientNoSponsor = getWalletClient(chainId, providerNoSponsor, smartAccountAddress)

  return {
    smartAccount,
    smartAccountAddress,
    withSponsor: {
      provider: providerWithSponsor,
      kernelClient: withSponsor,
      walletClient: walletClientWithSponsor,
    },
    noSponsor: {
      provider: providerNoSponsor,
      kernelClient: noSponsor,
      walletClient: walletClientNoSponsor,
    },
  }
}

function createAccountClient(
  account: KernelAccount,
  chain: Chain,
  zeroDev: ZeroDev,
  withSponsorship: boolean
) {
  return createKernelAccountClient({
    account,
    chain,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    bundlerTransport: http(zeroDev.bundlerRpc),
    middleware: withSponsorship
      ? {
          sponsorUserOperation: async ({ userOperation }) => {
            const zerodevPaymaster = createZeroDevPaymasterClient({
              chain,
              entryPoint: ENTRYPOINT_ADDRESS_V07,
              transport: http(zeroDev.paymasterRpc),
            })
            return zerodevPaymaster.sponsorUserOperation({
              userOperation,
              entryPoint: ENTRYPOINT_ADDRESS_V07,
            })
          },
        }
      : undefined,
  })
}
