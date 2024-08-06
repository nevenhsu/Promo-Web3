import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { updateUserWallet } from '@/lib/db/userWallet'

// Get the referrals of the current user
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const data = await req.json()
    const { address, walletClientType, connectorType, supported } = data

    const wallet = await updateUserWallet(userId, {
      address,
      walletClientType,
      connectorType,
      supported,
    })

    return NextResponse.json({
      wallet,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
