import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getPublicActivities } from '@/lib/db/activity'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id

    const { ongoing, skip = 0, limit = 10, sort = 'desc' } = await req.json()

    await dbConnect()

    const activities = await getPublicActivities(ongoing, skip, limit, sort, userId)

    const hasMore = activities.length === limit
    const nextSkip = hasMore ? skip + limit : undefined

    return NextResponse.json({ data: activities, hasMore, nextSkip })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
