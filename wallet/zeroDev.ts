import type { SupportedChainIds } from '@/wallet/variables'

type ZeroDev = {
  projectId: string
  bundlerRpc: string
  paymasterRpc: string
}

const base = {}

const baseSepolia: ZeroDev = {
  projectId: 'da03ad68-fdc7-4de6-a4c6-f309d4f67329',
  bundlerRpc: 'https://rpc.zerodev.app/api/v2/bundler/da03ad68-fdc7-4de6-a4c6-f309d4f67329',
  paymasterRpc: 'https://rpc.zerodev.app/api/v2/paymaster/da03ad68-fdc7-4de6-a4c6-f309d4f67329',
}

export function getZeroDev(chainId: number | undefined) {
  switch (chainId) {
    case 84532:
      return baseSepolia
    default:
      return undefined
  }
}
