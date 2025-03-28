import { base, baseSepolia, arbitrumSepolia } from 'viem/chains'
import { publicEnv } from '@/utils/env'
import type { Chain } from 'viem'

const defaultChain = publicEnv.chainTestnet ? baseSepolia : arbitrumSepolia
const supportedChains: Chain[] = [arbitrumSepolia, baseSepolia]

export { defaultChain, supportedChains }

export type SupportedChainIds = (typeof supportedChains)[number]['id']

export function getProviderUrl(chainId: number) {
  switch (chainId) {
    case arbitrumSepolia.id:
      return getAlchemyUrl('arb-sepolia') || getInfuraUrl('arbitrum-sepolia')
    case base.id:
      return getAlchemyUrl('base-mainnet') || getInfuraUrl('base-mainnet')
    case baseSepolia.id:
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
