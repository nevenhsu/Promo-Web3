import { arbitrum, arbitrumSepolia, baseSepolia } from 'viem/chains'

type ZeroDev = {
  projectId: string
  bundlerRpc: string
  paymasterRpc: string
}

const baSepolia: ZeroDev = {
  projectId: 'da03ad68-fdc7-4de6-a4c6-f309d4f67329',
  bundlerRpc: 'https://rpc.zerodev.app/api/v2/bundler/da03ad68-fdc7-4de6-a4c6-f309d4f67329',
  paymasterRpc: 'https://rpc.zerodev.app/api/v2/paymaster/da03ad68-fdc7-4de6-a4c6-f309d4f67329',
}

const arbSepolia: ZeroDev = {
  projectId: '0f3dc238-6992-4c6a-a7dd-7e9fec9b58bd',
  bundlerRpc: 'https://rpc.zerodev.app/api/v2/bundler/0f3dc238-6992-4c6a-a7dd-7e9fec9b58bd',
  paymasterRpc: 'https://rpc.zerodev.app/api/v2/paymaster/0f3dc238-6992-4c6a-a7dd-7e9fec9b58bd',
}

export function getZeroDev(chainId: number | undefined) {
  switch (chainId) {
    case baseSepolia.id:
      return baSepolia
    case arbitrumSepolia.id:
      return arbSepolia
    default:
      return undefined
  }
}
