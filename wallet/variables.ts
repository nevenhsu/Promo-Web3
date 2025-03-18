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
      return getInfuraUrl('arbitrum-sepolia') || getAlchemyUrl('arb-sepolia')
    case base.id:
      return getInfuraUrl('base-mainnet') || getAlchemyUrl('base-mainnet')
    case baseSepolia.id:
      return getInfuraUrl('base-sepolia') || getAlchemyUrl('base-sepolia')
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
