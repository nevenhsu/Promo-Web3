import * as _ from 'lodash-es'
import { Types } from 'mongoose'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserWallet } from '@/lib/db/userWallet'
import { getTokenBySymbol } from '@/lib/db/userToken'
import { getActivityBySlug, updateActivity } from '@/lib/db/activity'
import { getCreateLog } from '@/lib/web3/activityManager'
import { getPublicActivities } from '@/lib/db/activity'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id

    // Parse query string parameters
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const ongoing = searchParams.get('ongoing') === 'true'

    await dbConnect()

    const data = await getPublicActivities({ page, limit }, { ongoing }, userId)

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update the activity NFT with the create event
export async function POST(req: NextRequest) {
  const { hash, slug } = await req.json()

  if (!hash || !slug) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    await dbConnect()

    const activity = await getActivityBySlug(slug)
    if (!activity || !activity._user || !activity.chainId) {
      return NextResponse.json({ error: 'Invalid activity' }, { status: 400 })
    }
    const { chainId } = activity
    const { nft, success, timestamp } = await getCreateLog({ chainId, hash })
    if (activity.nft?.nftId && activity.nft.nftId !== nft.nftId) {
      return NextResponse.json({ error: 'Invalid activity NFT' }, { status: 400 })
    }

    const { nftId, symbol, startTime, endTime, owner, totalAmount, status } = nft

    // Activity must be owned by the user
    const wallet = await getUserWallet(owner, true)
    if (!wallet || wallet._user.toString() !== activity._user.toString()) {
      return NextResponse.json({ error: 'Invalid owner' }, { status: 400 })
    }

    // ClubToken must be owned by the user
    const userToken = await getTokenBySymbol({ symbol, chainId })
    if (!userToken || userToken._user.toString() !== wallet._user.toString()) {
      return NextResponse.json({ error: 'Invalid userToken' }, { status: 400 })
    }

    // Update the activity NFT
    const distributed = status !== 0
    const newActivity = await updateActivity(activity._id.toString(), {
      startTime,
      endTime,
      nft: {
        nftId,
        distributed,
        totalAmount,
        distributedAmount: '0',
        feeAmount: '0',
        refundedAmount: '0',
      },
      airdrop: {
        _userToken: userToken._id as any,
        amount: totalAmount,
        symbol,
      },
    })

    return NextResponse.json({ success, timestamp, activity: newActivity })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
