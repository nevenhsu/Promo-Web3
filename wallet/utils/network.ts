type NetworkInfo = {
  chainId: number
  name: string
  icon: string
}

export function getNetworkName(chainId?: string) {
  switch (chainId) {
    case 'eip155:1':
      return 'Ethereum Mainnet'
    case 'eip155:1337':
      return 'Localhost Testnet'
    default:
      return 'Unknown Network'
  }
}
