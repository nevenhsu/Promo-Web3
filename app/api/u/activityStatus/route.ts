import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserActivityStatuses } from '@/lib/db/userActivityStatus'

// Get the transactions of the current user
export async function GET(req: NextRequest) {
  try {
    // Parse query string parameters
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10

    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()

    const data = await getUserActivityStatuses(userId, { page, limit })

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
