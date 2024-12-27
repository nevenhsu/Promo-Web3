import type { Chain, Transport, Account, WalletClient as _WalletClient } from 'viem'
import { type SmartAccount } from 'viem/account-abstraction'
import type { KernelAccountClient } from '@zerodev/sdk'
import type { KernelEIP1193Provider } from '@zerodev/sdk/providers'

export type WalletClient = _WalletClient<Transport, Chain, Account>

export type KernelProvider = KernelEIP1193Provider

export type KernelClient = KernelAccountClient<Transport, Chain, SmartAccount>
