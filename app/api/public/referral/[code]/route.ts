import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { filterUserData } from '@/lib/db/user'
import { getRefererByCode } from '@/lib/db/referralCode'

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    await dbConnect()

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const doc = await getRefererByCode(code)

    if (!doc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: filterUserData(doc._user) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
