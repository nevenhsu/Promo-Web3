import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import UserTokenModel from '@/models/userToken'
import { getUserWallets } from '@/lib/db/userWallet'
import { getTokenContract } from '@/contracts'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { isAddress, isAddressEqual } from '@/wallet/utils/helper'
import { uploadTokenIcon } from '@/lib/db/userToken'

export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!
    const { chainId, walletAddress, iconURI } = await req.json()

    await dbConnect()

    const wallets = await getUserWallets(userId)
    const wallet = wallets.find(w => isAddressEqual(w.address, walletAddress))
    const walletId = wallet?._id.toString() || ''
    const owner = wallet?.address || ''

    if (!walletId || !isAddress(owner)) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const client = getPublicClient(chainId)

    if (!client) {
      return NextResponse.json({ error: 'Unsupported chain' }, { status: 400 })
    }

    const tokenContract = getTokenContract(client as any, owner)

    const [name, symbol] = await Promise.all([
      tokenContract.read.name(),
      tokenContract.read.symbol(),
    ])

    const data = {
      name,
      symbol,
      chainId,
      _user: userId,
      _wallet: walletId,
      icon: '',
    }

    const url = await uploadTokenIcon(userId, walletId, iconURI)
    if (url) {
      data.icon = url
    }

    const token = await UserTokenModel.findOneAndUpdate(
      { _user: data._user, _wallet: data._wallet, chainId },
      data,
      { upsert: true, new: true }
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
