import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getReferrer } from '@/lib/db/referral'

// Get the referrer of the current user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const referral = await getReferrer(userId)

    if (!referral?._referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 })
    }

    return NextResponse.json({ referrer: filterData(referral._referrer) })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function filterData(data: any) {
  return _.pick(data, ['username', 'name', 'details'])
}
