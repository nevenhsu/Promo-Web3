import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getReferrer } from '@/lib/db/referral'
import { filterUserData } from '@/lib/db/user'

// Get the referrer of the current user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const referral = await getReferrer(userId)

    if (!referral?._referrer) {
      // No referrer
      return NextResponse.json({})
    }

    return NextResponse.json({ referrer: filterUserData(referral._referrer) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
