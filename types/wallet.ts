import type { Chain, Transport, Account, WalletClient as _WalletClient } from 'viem'
import type { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types'
import type { KernelSmartAccount, KernelAccountClient } from '@zerodev/sdk'
import type { KernelEIP1193Provider } from '@zerodev/sdk/providers'

export type WalletClient = _WalletClient<Transport, Chain, Account>

export type KernelAccount = KernelSmartAccount<ENTRYPOINT_ADDRESS_V07_TYPE, Transport, Chain>

export type KernelProvider = KernelEIP1193Provider<ENTRYPOINT_ADDRESS_V07_TYPE>

export type KernelClient = KernelAccountClient<
  ENTRYPOINT_ADDRESS_V07_TYPE,
  Transport,
  Chain,
  KernelAccount
>
