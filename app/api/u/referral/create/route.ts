import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { createReferral } from '@/lib/db/referral'
import { getUserByUsername, filterUserData } from '@/lib/db/user'

// Create a referral for the current user
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const refereeId = token?.user?.id!

    const data = await req.json()
    const { referrer } = data // referrer is username

    if (!referrer) {
      return NextResponse.json({ error: 'Referrer is required' }, { status: 400 })
    }

    await dbConnect()

    const referrerUser = await getUserByUsername(referrer)
    if (!referrerUser) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 })
    }

    const referrerId = referrerUser._id.toString()
    if (referrerId === refereeId) {
      return NextResponse.json({ error: 'You cannot refer yourself' }, { status: 400 })
    }

    const referral = await createReferral(referrerId, refereeId)
    if (!referral) {
      return NextResponse.json(
        { error: 'Referral already exists. Please try another code.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ referrer: filterUserData(referrerUser) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
