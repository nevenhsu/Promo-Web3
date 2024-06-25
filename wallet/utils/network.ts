type NetworkInfo = {
  chainId: number
  name: string
  icon: string
}

export function getNetworkName(chainId?: string | number) {
  const chainIdNum = toChainId(chainId || '0')
  return toNetworkName(chainIdNum)
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

function toNetworkName(chainId?: number) {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet'
    case 8453:
      return 'Base'
    case 84532:
      return 'Base Sepolia'
    case 1337:
      return 'Localhost'
    case 31337:
      return 'Hardhat'
    default:
      return 'Unknown Network'
  }
}

export function toHex(num: number) {
  return '0x' + num.toString(16)
}
