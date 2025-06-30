import { isAddressEqual as _isAddressEqual, isAddress as _isAddress, type Hash } from 'viem'
import type { KernelClient, WalletClient } from '@/types/wallet'

export function unifyAddress(address: string) {
  return address.toLowerCase() as Hash
}

export function wait(milliseconds = 1000, any: any = undefined) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(any)
    }, milliseconds)
  })
}

export function formatAddress(address?: string): string {
  if (!address) {
    return ''
  }

  const start = address.slice(0, 10) // Extract the first 8 characters
  const end = address.slice(-8) // Extract the last 8 characters
  return `${start}...${end}` // Combine them with an ellipsis
}

export function isAddressEqual(addr1: string, addr2: string) {
  try {
    return _isAddressEqual(addr1 as any, addr2 as any)
  } catch {
    return false
  }
}

export function isAddress(address: string) {
  return _isAddress(address, { strict: false })
}

export function isKernelClient(client: WalletClient | KernelClient): client is KernelClient {
  return (client as KernelClient).sendUserOperation !== undefined
}

export function isWalletClient(client: WalletClient | KernelClient): client is WalletClient {
  return (client as WalletClient).sendTransaction !== undefined
}
