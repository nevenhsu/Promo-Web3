import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { createActivity } from '@/lib/db/activity'
import { getTokenBySymbol } from '@/lib/db/userToken'

// create an activity with chainId, etc...
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { data } = await req.json()

    await dbConnect()
    const filtered = filterData(data)

    // check if user token exists
    const userToken = await getTokenBySymbol({
      symbol: filtered.airdrop.symbol,
      chainId: filtered.chainId,
    })

    if (userToken?._user.toString() !== userId) {
      return NextResponse.json({ error: 'Invalid user token' }, { status: 400 })
    }

    filtered.airdrop._userToken = userToken._id

    const created = await createActivity({
      ...filtered,
      _user: userId,
    })

    return NextResponse.json({ activity: created })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function filterData(data: any) {
  const filtered = _.pick(data, [
    'chainId',
    'startTime',
    'endTime',
    'activityType',
    'socialMedia',
    'airdrop',
    'details',
    'setting',
  ])

  if (
    !filtered.chainId ||
    !filtered.activityType ||
    !filtered.socialMedia ||
    !filtered.startTime ||
    !filtered.endTime ||
    !filtered.airdrop.symbol ||
    !filtered.airdrop.amount ||
    !filtered.details.link ||
    !filtered.setting
  ) {
    throw new Error('invalid data')
  }

  return filtered as any
}
