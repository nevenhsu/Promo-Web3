import { arbitrum, arbitrumSepolia, baseSepolia } from 'viem/chains'
import { publicEnv } from '@/utils/env'

const defaultChain = publicEnv.chainTestnet ? arbitrumSepolia : arbitrumSepolia
const supportedChains = [arbitrum, arbitrumSepolia, baseSepolia]

export { defaultChain, supportedChains }

export type SupportedChainIds = (typeof supportedChains)[number]['id']

export function getProviderUrl(chainId: number) {
  switch (chainId) {
    case arbitrum.id:
      return getInfuraUrl('arbitrum-mainnet') || getAlchemyUrl('arb-mainnet')
    case arbitrumSepolia.id:
      return getInfuraUrl('arbitrum-sepolia') || getAlchemyUrl('arb-sepolia')
    case baseSepolia.id:
      // infura may not support this network
      return getAlchemyUrl('base-sepolia') || getInfuraUrl('base-sepolia')
    default:
      return undefined
  }
}

function getInfuraUrl(network: string) {
  const { infuraKey } = publicEnv.api
  if (!infuraKey) return

  return `https://${network}.infura.io/v3/${infuraKey}`
}

function getAlchemyUrl(network: string) {
  const { alchemyKey } = publicEnv.api
  if (!alchemyKey) return

  return `https://${network}.g.alchemy.com/v2/${alchemyKey}`
}
