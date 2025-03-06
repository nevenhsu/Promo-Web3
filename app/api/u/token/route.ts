import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { clearTokenUpdatedAt } from '@/lib/db/token'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    return NextResponse.json({})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Clear token timestamp
export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const json = await req.json()
    const userId = jwt?.user?.id!
    const { userTokenIds } = json

    if (!userId || !userTokenIds.length) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    await dbConnect()
    const result = await clearTokenUpdatedAt(userId, userTokenIds)

    return NextResponse.json({ result })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
