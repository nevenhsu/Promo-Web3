import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getReferralCount } from '@/lib/db/referral'
import { ReferralLevel } from '@/types/db'

// Get the referral count of the current user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const lv1 = await getReferralCount(userId, ReferralLevel.First)
    const lv2 = await getReferralCount(userId, ReferralLevel.Second)

    return NextResponse.json({ lv1, lv2 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
