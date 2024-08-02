'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { http } from 'viem'
import { providerToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import {
  createZeroDevPaymasterClient,
  createKernelAccount,
  createKernelAccountClient,
} from '@zerodev/sdk'
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator'
import { KernelEIP1193Provider } from '@zerodev/sdk/providers'
import { getZeroDev } from '@/wallet/zeroDev'
import { getPublicClient } from '@/wallet/publicClients'
import { KERNEL_V3_1 } from '@zerodev/sdk/constants'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types'
import type { Account, Hash } from 'viem'

export type KernelProvider = KernelEIP1193Provider<ENTRYPOINT_ADDRESS_V07_TYPE>

const kernelVersion = KERNEL_V3_1

export function useSmartAccount(chainId?: number) {
  // Find the embedded wallet and get its EIP1193 provider
  const wallet = useWallet()

  const [smartAccountAddress, setSmartAccountAddress] = useState<Hash>()
  const [kernelProvider, setKernelProvider] = useState<KernelProvider>()
  const [account, setAccount] = useState<Account>()

  useEffect(() => {
    const zeroDev = getZeroDev(chainId)
    if (wallet && zeroDev) {
      getAccountClient(wallet, chainId)
        .then(res => {
          if (res) {
            const { kernelProvider, accountAddress, account } = res
            if (kernelProvider && accountAddress) {
              setKernelProvider(kernelProvider)
              setSmartAccountAddress(accountAddress)
            }
          }
        })
        .catch(console.error)
    } else {
      setKernelProvider(undefined)
      setSmartAccountAddress(undefined)
    }
  }, [wallet, chainId])

  return { kernelProvider, smartAccountAddress }
}

async function getAccountClient(wallet: ConnectedWallet, chainId: number | undefined) {
  const zeroDev = getZeroDev(chainId)
  const publicClient = getPublicClient(chainId)

  if (wallet && zeroDev && publicClient) {
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
    const kernelClient = createKernelAccountClient({
      account,
      chain,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      bundlerTransport: http(zeroDev.bundlerRpc),
      middleware: {
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
      },
    })

    const accountAddress = kernelClient.account.address
    const kernelProvider = new KernelEIP1193Provider(kernelClient)
    console.log('Smart account created:', accountAddress)

    return { kernelProvider, accountAddress, account }
  }
}
