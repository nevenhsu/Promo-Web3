import { base, baseSepolia } from 'viem/chains'

export type ZeroDev = {
  projectId: string
  bundlerRpc: string
  paymasterRpc: string
}

const baseSepoliaData: ZeroDev = {
  projectId: 'e319936b-ab7d-4afc-9319-1421336b0c4c',
  bundlerRpc: 'https://rpc.zerodev.app/api/v2/bundler/e319936b-ab7d-4afc-9319-1421336b0c4c',
  paymasterRpc: 'https://rpc.zerodev.app/api/v2/paymaster/e319936b-ab7d-4afc-9319-1421336b0c4c',
}

export function getZeroDev(chainId: number | undefined) {
  switch (chainId) {
    case baseSepolia.id:
      return baseSepoliaData
    default:
      return undefined
  }
}
