import { arbitrum, arbitrumSepolia } from 'viem/chains'
import { publicEnv } from '@/utils/env'

const defaultChain = publicEnv.isProd ? arbitrum : arbitrumSepolia
const supportedChains = [arbitrum, arbitrumSepolia]

export { defaultChain, supportedChains }

export type SupportedChainIds = (typeof supportedChains)[number]['id']
