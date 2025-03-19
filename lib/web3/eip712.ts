import * as _ from 'lodash-es'
import { getContract, parseSignature } from 'viem'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'
import { ClubToken$Type } from '@/contracts/ClubToken.sol/ClubToken'
import type { GetContractReturnType, Hash } from 'viem'
import type { SignerClient } from '@/types/wallet'

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

export async function permitToken(
  wallet: SignerClient,
  token: Hash,
  spender: Hash,
  value: bigint,
  deadline: bigint
) {
  const { domain, nonce } = await getPermitData(wallet, token)

  const message = {
    owner: wallet.account.address,
    spender,
    value,
    nonce,
    deadline,
  }

  const signature = await wallet.signTypedData({
    primaryType: 'Permit',
    domain,
    types,
    message,
  })

  const parsed = parseSignature(signature)

  if (parsed.v === undefined) {
    throw Error('Invalid signature')
  }

  return parsed
}

async function getPermitData(client: SignerClient, token: Hash) {
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
  client: SignerClient,
  address: Hash
): GetContractReturnType<ClubToken$Type['abi'], SignerClient> {
  const contract = getContract({
    address,
    abi: clubTokenJson.abi,
    client,
  })
  return contract as any
}
