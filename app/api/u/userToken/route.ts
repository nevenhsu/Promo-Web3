import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserTokens, updateUserToken, getUserToken, uploadTokenIcon } from '@/lib/db/userToken'
import { updateBalance } from '@/lib/balance'
import { getUserWallets } from '@/lib/db/userWallet'
import { addTokenBalance } from '@/lib/db/tokenBalance'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()
    const tokens = await getUserTokens(userId)

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const json = await req.json()
    const userId = jwt?.user?.id!
    const { docId, iconURI } = json

    if (!docId) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 })
    }

    await dbConnect()

    const doc = await getUserToken(docId)
    if (!doc || doc._user.toString() !== userId) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }
    // upload image to GCP
    const { chainId, _wallet } = doc
    const walletId = _wallet.toString()
    const url = await uploadTokenIcon(userId, `${walletId}-${chainId}`, iconURI)

    if (!url) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    const token = await updateUserToken(docId, { icon: url })

    if (!token) {
      return NextResponse.json({ error: 'Failed to update token' }, { status: 500 })
    }

    // create tokenBalance docs
    const wallets = await getUserWallets(userId, true)
    await Promise.all(
      wallets.map(wallet =>
        addTokenBalance(userId, wallet._id, token._id, token.chainId, token.symbol)
      )
    )
    await updateBalance(userId, token._id)

    return NextResponse.json({ token })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
