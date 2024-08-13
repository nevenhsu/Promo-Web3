import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getReferralByLevel } from '@/lib/db/referral'
import { filterUserData } from '@/lib/db/user'
import { ReferralLevel } from '@/types/db'

// Get the referrals of the current user
export async function GET(req: NextRequest) {
  try {
    // Parse query string parameters
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const level = Number(searchParams.get('level'))

    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    if (!_.includes(ReferralLevel, level)) {
      return NextResponse.json({ error: 'Invalid referral level' }, { status: 400 })
    }

    const data = await getReferralByLevel(userId, level, { page, limit })

    return NextResponse.json({
      referrals: data.docs.map(o => {
        return { ...o, referee: filterUserData(o._referee) }
      }),
      limit: data.limit,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
