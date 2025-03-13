import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { saveTransaction, getTransactions } from '@/lib/db/transaction'
import { getTransferLog } from '@/lib/web3/erc20'
import { getEthTxLog } from '@/lib/web3/eth'
import { getUserWallets } from '@/lib/db/userWallet'
import { getTokenBySymbol } from '@/lib/db/userToken'
import { TxStatus, TxType } from '@/types/db'
import { isAddressEqual } from '@/wallet/utils/helper'

// Save a transaction for the current user
export async function PUT(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    const data = await req.json()
    const value = pickData(data)

    // fetch onchain data
    if (value.type === TxType.ERC20) {
      const log = await getTransferLog(value)

      // check if token is UserToken
      const userToken = await getTokenBySymbol({ symbol: log.symbol, chainId: value.chainId })

      // override value with onchain data
      value.status = log.success ? TxStatus.Success : TxStatus.Failed
      value.token.amount = log.amount
      value.token.symbol = log.symbol
      value.token._userToken = userToken?._id
      value.createdAt = log.timestamp
      value.from = log.from
      value.to = log.to
    }

    if (value.type === TxType.Native) {
      const log = await getEthTxLog(value)

      // override value with onchain data
      value.status = log.success ? TxStatus.Success : TxStatus.Failed
      value.token.amount = log.amount
      value.token.symbol = 'ETH'
      value.createdAt = log.timestamp
      value.from = log.from
      value.to = log.to
      value.token._userToken = null
    }

    // Check if the user has the wallet
    const wallets = await getUserWallets(userId)
    const fromWallet = wallets.find(w => isAddressEqual(w.address, value.from))
    if (!fromWallet) {
      return NextResponse.json({ error: 'Invalid user wallet' }, { status: 400 })
    }

    const tx = await saveTransaction(value)

    return NextResponse.json({
      tx,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get the transactions of the current user
export async function GET(req: NextRequest) {
  try {
    // Parse query string parameters
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const isAirdrop = searchParams.get('isAirdrop') === 'true'

    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    const data = await getTransactions(userId, { page, limit }, { isAirdrop })

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function pickData(data: any) {
  const val = _.pick(data, [
    'chainId',
    'hash',
    'contract',
    'type',
    'from',
    'to',
    'status',
    'createdAt',
    'token',
    'details',
    'isAirdrop',
  ])

  return val
}
