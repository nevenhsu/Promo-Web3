type NetworkInfo = {
  chainId: number
  name: string
  icon: string
  subtitle: string
}

export const networks: NetworkInfo[] = [
  { chainId: 1, name: 'Ethereum Mainnet', icon: '/icons/base.svg', subtitle: 'Ethereum Mainnet' },
  { chainId: 8453, name: 'Base', icon: '/icons/base.svg', subtitle: 'Ethereum L2 Network' },
  {
    chainId: 84532,
    name: 'Base Sepolia',
    icon: '/icons/base-testnet.svg',
    subtitle: 'Ethereum L2 Testnet',
  },
  { chainId: 31337, name: 'Hardhat', icon: '/icons/hardhat.svg', subtitle: 'Hardhat Network' },
]

export function getNetwork(chainId?: string | number) {
  const chainIdNum = toChainId(chainId || '0')
  const network = networks.find(o => o.chainId === chainIdNum)
  const fallback = {
    chainId: chainIdNum,
    name: 'Unknown',
    icon: '/icons/base.svg',
    subtitle: 'Network Error',
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
