import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserStatus } from '@/lib/db/userStatus'
import { getAllAirdrops } from '@/lib/db/airdrop'
import { countUserActivityStatus } from '@/lib/db/userActivityStatus'

// Get the status of the current user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const status = await getUserStatus(userId)
    const airdrops = await getAllAirdrops(userId)
    const finalized = await countUserActivityStatus(userId, true)
    const ongoing = await countUserActivityStatus(userId, false)
    const total = finalized + ongoing
    const progress = { total, finalized, ongoing }

    return NextResponse.json({ status, airdrops, progress })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
