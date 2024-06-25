'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { createPublicClient, http } from 'viem'
import { providerToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07 } from 'permissionless'
import {
  createZeroDevPaymasterClient,
  createKernelAccount,
  createKernelAccountClient,
} from '@zerodev/sdk'
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator'
import { supportedChains } from '@/wallet/variables'
import { getZeroDev } from '@/wallet/zerodev'
import { KERNEL_V3_1 } from '@zerodev/sdk/constants'

const kernelVersion = KERNEL_V3_1

type WalletType = ReturnType<typeof useWallet>
export type AccountClient = Awaited<ReturnType<typeof getAccountClient>>

export function useSmartAccount(chainId?: number) {
  // Find the embedded wallet and get its EIP1193 provider
  const wallet = useWallet()

  const [accountClient, setAccountClient] = useState<AccountClient>()

  useEffect(() => {
    const zeroDev = getZeroDev(chainId)
    if (wallet && zeroDev) {
      getAccountClient(wallet, chainId)
        .then(accountClient => {
          if (accountClient) {
            setAccountClient(accountClient)
          }
        })
        .catch(console.error)
    }
  }, [wallet, chainId])

  return accountClient
}

async function getAccountClient(wallet: WalletType, chainId: number | undefined) {
  const zeroDev = getZeroDev(chainId)

  if (wallet && zeroDev) {
    const provider = await wallet.getEthereumProvider()

    // Use the EIP1193 `provider` from Privy to create a `SmartAccountSigner`
    const smartAccountSigner = await providerToSmartAccountSigner(provider as any)

    // Initialize a viem public client on your app's desired network
    const chain = supportedChains.find(({ id }) => id === chainId)!
    const publicClient = createPublicClient({
      transport: http(chain.rpcUrls.default.http[0]),
    })

    // @ts-ignore
    // Create a ZeroDev ECDSA validator from the `smartAccountSigner` from above and your `publicClient`
    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      signer: smartAccountSigner,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      kernelVersion,
    })

    // @ts-ignore
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

    console.log('Smart account created:', kernelClient.account.address)

    return kernelClient
  }
}
