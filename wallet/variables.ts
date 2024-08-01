import { createPublicClient, http } from 'viem'
import { arbitrum, arbitrumSepolia } from 'viem/chains'
import { publicEnv } from '@/utils/env'

const defaultChain = publicEnv.isProd ? arbitrum : arbitrumSepolia
const supportedChains = [arbitrum, arbitrumSepolia]

const clients = supportedChains.map(chain =>
  createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport: http(),
  })
)

export { defaultChain, supportedChains, clients }

export type SupportedChainIds = (typeof supportedChains)[number]['id']
