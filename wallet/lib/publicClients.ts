import * as _ from 'lodash-es'
import { createPublicClient, http } from 'viem'
import { supportedChains, getProviderUrl } from '@/wallet/variables'

const clients = supportedChains.map(chain =>
  createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport: http(getProviderUrl(chain.id) || chain.rpcUrls.default.http[0]),
  })
)

const publicClients = _.keyBy(clients, o => o.chain.id)

export function getPublicClient(chainId: number | undefined) {
  return chainId ? publicClients[chainId] : undefined
}

export { publicClients }
