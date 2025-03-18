import { base, baseSepolia, arbitrumSepolia } from 'viem/chains'

export type ZeroDev = {
  projectId: string
  bundlerRpc: string
  paymasterRpc: string
}

const projectIds: { [chainId: string]: string } = {
  [baseSepolia.id]: '310899e8-9775-4456-9fea-e700f64fe575',
  [arbitrumSepolia.id]: '138d2dea-1135-40fb-8129-19c85f3c1875',
}

export function getZeroDev(chainId: number | undefined) {
  const projectId = projectIds[`${chainId}`]
  if (!projectId) return undefined

  return {
    projectId,
    bundlerRpc: `https://rpc.zerodev.app/api/v2/bundler/${projectId}`,
    paymasterRpc: `https://rpc.zerodev.app/api/v2/paymaster/${projectId}`,
  }
}
