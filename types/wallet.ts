import type * as viemT from 'viem'
import type { SmartAccount } from 'viem/account-abstraction'
import type { KernelAccountClient } from '@zerodev/sdk'
import type { KernelEIP1193Provider } from '@zerodev/sdk/providers'

export type KernelProvider = KernelEIP1193Provider

export type KernelClient = KernelAccountClient<viemT.Transport, viemT.Chain, SmartAccount>

export type PublicClient = viemT.PublicClient<viemT.Transport, viemT.Chain>
export type WalletClient = viemT.WalletClient<viemT.Transport, viemT.Chain, viemT.Account>

export type KeyedClient =
  | {
      public?: PublicClient
      wallet: WalletClient
    }
  | {
      public: PublicClient
      wallet?: WalletClient
    }

export type GetContractReturnType<TAbi extends viemT.Abi | readonly unknown[] = viemT.Abi> =
  viemT.GetContractReturnType<TAbi, Required<KeyedClient>, viemT.Address>
