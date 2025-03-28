import * as _ from 'lodash-es'
import { getContract, parseSignature } from 'viem'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'
import { ClubToken$Type } from '@/contracts/ClubToken.sol/ClubToken'
import type { GetContractReturnType, Hash } from 'viem'
import type { WalletClient } from '@/types/wallet'

const fieldNames = ['name', 'version', 'chainId', 'verifyingContract', 'salt'] as const

const types = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const

// Only support EOA wallet
export async function permitToken(
  wallet: WalletClient,
  token: Hash,
  spender: Hash,
  value: bigint,
  deadline: number
) {
  const { domain, nonce } = await getPermitData(wallet, token)

  const message = {
    owner: wallet.account.address,
    spender,
    value,
    nonce,
    deadline: BigInt(deadline),
  }

  const signature = await wallet.signTypedData({
    primaryType: 'Permit',
    domain,
    types,
    message,
  })

  const result = parseSignature(signature)

  if (!result.v) {
    throw Error('Invalid signature')
  }

  return result
}

async function getPermitData(client: WalletClient, token: Hash) {
  const contract = getTokenContract(client, token)

  const [fieldsString, name, version, chainId, verifyingContract, salt, extensions] =
    await contract.read.eip712Domain()
  const nonce = await contract.read.nonces([client.account.address])

  if (extensions.length > 0) {
    throw Error('Extensions not implemented')
  }

  const fields = Number(fieldsString)
  const domain = { name, version, chainId: Number(chainId), verifyingContract, salt }

  _.forEach(fieldNames, (field, i) => {
    if (!(fields & (1 << i))) {
      _.unset(domain, field)
    }
  })

  return { domain, nonce }
}

function getTokenContract(
  client: WalletClient,
  address: Hash
): GetContractReturnType<ClubToken$Type['abi'], WalletClient> {
  const contract = getContract({
    address,
    abi: clubTokenJson.abi,
    client,
  })
  return contract as any
}
