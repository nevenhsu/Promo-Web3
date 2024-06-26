import { hardhat, base, baseSepolia } from 'viem/chains'
import { publicEnv } from '@/utils/env'

const defaultChain = publicEnv.isProd ? base : baseSepolia
const supportedChains = [hardhat, base, baseSepolia]

export { defaultChain, supportedChains }

export type SupportedChainIds = (typeof supportedChains)[number]['id']
