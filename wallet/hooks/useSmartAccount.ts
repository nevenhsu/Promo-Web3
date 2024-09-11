'use client'

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { providerToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import {
  createZeroDevPaymasterClient,
  createKernelAccount,
  createKernelAccountClient,
  type KernelSmartAccount,
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
import type { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types'
import type { Hash, Chain, WalletClient } from 'viem'

// Get current wallet values from Web3Context
// instead of using this hook directly

export type KernelProvider = KernelEIP1193Provider<ENTRYPOINT_ADDRESS_V07_TYPE>
type KernelAccount = KernelSmartAccount<ENTRYPOINT_ADDRESS_V07_TYPE>

const kernelVersion = KERNEL_V3_1

export function useSmartAccount() {
  const { wallets } = useWallets()
  const wallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const chainId = toChainId(wallet?.chainId)

  // Smart account values
  const [smartAccountAddress, setSmartAccountAddress] = useState<Hash>()
  const [smartClientWithSponsor, setSmartClientWithSponsor] = useState<WalletClient>()
  const [smartClientNoSponsor, setSmartClientNoSponsor] = useState<WalletClient>()
  const [loading, setLoading] = useState(true)

  const setupSmartAccount = async (privyWallet: ConnectedWallet, chainId: number) => {
    try {
      setLoading(true)
      const res = await getAccountClient(privyWallet, chainId)

      if (!res?.smartAccountAddress) {
        throw new Error('Smart account not created')
      }

      console.log('Smart account created:', res.smartAccountAddress)

      const { kernelProvider, smartAccountAddress } = res
      setSmartAccountAddress(smartAccountAddress)
      setSmartClientWithSponsor(
        getWalletClient(chainId, kernelProvider.withSponsor, smartAccountAddress)
      )
      setSmartClientNoSponsor(
        getWalletClient(chainId, kernelProvider.noSponsor, smartAccountAddress)
      )
    } catch (err) {
      console.error(err)
      setSmartAccountAddress(undefined)
      setSmartClientWithSponsor(undefined)
      setSmartClientNoSponsor(undefined)
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
    smartClientWithSponsor,
    smartClientNoSponsor,
    loading,
  }
}

async function getAccountClient(wallet: ConnectedWallet, chainId: number | undefined) {
  const zeroDev = getZeroDev(chainId)
  const publicClient = getPublicClient(chainId)

  // Check if the ZeroDev and public client are available
  if (!zeroDev || !publicClient) return

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
  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    kernelVersion,
  })

  // Create a Kernel account client to send user operations from the smart account
  const withSponsor = new KernelEIP1193Provider(createAccountClient(account, chain, zeroDev, true))
  const noSponsor = new KernelEIP1193Provider(createAccountClient(account, chain, zeroDev, false))
  const smartAccountAddress = account.address

  return {
    kernelProvider: {
      withSponsor,
      noSponsor,
    },
    smartAccountAddress,
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
