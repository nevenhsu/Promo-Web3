import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserStatus } from '@/lib/db/userStatus'
import { countUserActivityStatus, getOngoingActivityStatuses } from '@/lib/db/userActivityStatus'

// Get the status of the current user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const status = await getUserStatus(userId)
    const finalized = await countUserActivityStatus(userId, true)
    const onGoingStatuses = await getOngoingActivityStatuses(userId)
    const ongoing = onGoingStatuses.length // count
    const total = finalized + ongoing
    const ongoingSocial = _.uniq(onGoingStatuses.map(o => o.socialMedia))
    const progress = { total, finalized, ongoing, ongoingSocial }

    return NextResponse.json({ status, progress })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
