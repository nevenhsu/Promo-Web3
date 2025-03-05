import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getBalancesOfAll, addTokenBalance } from '@/lib/db/tokenBalance'
import { updateBalance } from '@/lib/balance'
import { getTokenBySymbol } from '@/lib/db/userToken'
import { getUserWallets } from '@/lib/db/userWallet'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()
    const tokens = await getBalancesOfAll(userId)

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update tokenBalance docs
export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const json = await req.json()
    const userId = jwt?.user?.id!
    const { symbol, chainId } = json

    if (!symbol || !chainId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    await dbConnect()
    const userToken = await getTokenBySymbol({ symbol, chainId })

    if (!userToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }
    const wallets = await getUserWallets(userId, true)

    await Promise.all(
      wallets.map(wallet => addTokenBalance(userId, wallet._id, userToken._id, chainId, symbol))
    )

    const tokens = await updateBalance(userId, userToken._id)

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
