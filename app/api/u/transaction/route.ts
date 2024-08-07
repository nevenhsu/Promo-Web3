import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { saveTransaction, getTransaction } from '@/lib/db/transaction'
import { getUserWallets } from '@/lib/db/userWallet'
import { TxStatus } from '@/types/db'
import { isAddressEqual } from '@/wallet/utils/helper'

// Create a transaction for the current user
export async function PUT(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    const data = await req.json()
    const value = pickData(data)

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

// Update the status of a transaction
export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    const data = await req.json()
    const { chainId, hash, status } = data

    const tx = await getTransaction(chainId, hash)

    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check if the user has the wallet
    const wallets = await getUserWallets(userId)
    const fromWallet = wallets.find(w => isAddressEqual(w.address, tx.from))
    if (!fromWallet) {
      return NextResponse.json({ error: 'Invalid user wallet' }, { status: 400 })
    }

    // Check if the status is valid
    if (status in TxStatus) {
      tx.status = status
      await tx.save()
    } else {
      return NextResponse.json({ error: 'Invalid transaction status' }, { status: 400 })
    }

    return NextResponse.json({ tx })
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
