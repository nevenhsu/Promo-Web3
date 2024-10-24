import { mainnet, base, baseSepolia, arbitrum, arbitrumSepolia } from 'viem/chains'

type NetworkInfo = {
  chainId: number
  name: string
  icon: string
  subtitle: string
  blockExplorerUrl: string
}

export const networks: NetworkInfo[] = [
  {
    chainId: mainnet.id,
    name: mainnet.name,
    icon: '/icons/base.svg',
    subtitle: 'Ethereum Mainnet',
    blockExplorerUrl: mainnet.blockExplorers.default.url,
  },
  {
    chainId: base.id,
    name: base.name,
    icon: '/icons/base.svg',
    subtitle: 'Ethereum L2 Network',
    blockExplorerUrl: base.blockExplorers.default.url,
  },
  {
    chainId: baseSepolia.id,
    name: baseSepolia.name,
    icon: '/icons/base-testnet.svg',
    subtitle: 'Ethereum L2 Testnet',
    blockExplorerUrl: baseSepolia.blockExplorers.default.url,
  },
  {
    chainId: arbitrum.id,
    name: arbitrum.name,
    icon: '/icons/arbitrum.svg',
    subtitle: 'Ethereum L2 Network',
    blockExplorerUrl: arbitrum.blockExplorers.default.url,
  },
  {
    chainId: arbitrumSepolia.id,
    name: arbitrumSepolia.name,
    icon: '/icons/arbitrum-testnet.svg',
    subtitle: 'Ethereum L2 Testnet',
    blockExplorerUrl: arbitrumSepolia.blockExplorers.default.url,
  },
] as const

export function getNetwork(chainId?: string | number) {
  const chainIdNum = toChainId(chainId || '0')
  const network = networks.find(o => o.chainId === chainIdNum)
  const fallback = {
    id: 'unknown',
    chainId: chainIdNum,
    name: 'Unknown',
    icon: '/icons/base.svg',
    subtitle: 'Network Error',
    blockExplorerUrl: '',
  }
  return network || fallback
}

export function toChainId(chainId?: string | number) {
  if (typeof chainId === 'string') {
    if (chainId.includes('eip155:')) {
      // eip155:1
      return parseInt(chainId.split(':')[1], 10)
    }
    return parseInt(chainId, 10)
  }

  return chainId
}

export function toHex(num: number) {
  return '0x' + num.toString(16)
}
