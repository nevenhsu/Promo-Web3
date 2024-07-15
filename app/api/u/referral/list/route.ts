import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getReferralByLevel } from '@/lib/db/referral'
import { filterUserData } from '@/lib/db/user'
import { ReferralLevel } from '@/types/db'

// Get the referrals of the current user
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const data = await req.json()
    const { level, limit, skip, sort } = data

    if (!_.includes(ReferralLevel, level)) {
      return NextResponse.json({ error: 'Invalid referral level' }, { status: 400 })
    }

    const referrals = await getReferralByLevel(userId, level, skip, sort, limit)

    return NextResponse.json({
      referrals: referrals.map(o => {
        return { ...o, referee: filterUserData(o._referee) }
      }),
    })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
