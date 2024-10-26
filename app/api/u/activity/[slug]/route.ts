import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getActivityBySlug, updateActivity } from '@/lib/db/activity'
import { parseData } from '@/lib/db/common'
import type { ActivityData } from '@/models/activity'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    await dbConnect()
    const doc = await getActivityBySlug(slug)

    if (!doc || doc._user?.toString() !== userId) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    return NextResponse.json({ activity: doc })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// update own activity
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { data } = await req.json()
    const { slug } = params

    await dbConnect()
    const doc = await getActivityBySlug(slug)

    if (!doc || doc._user?.toString() !== userId) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const filtered = filterData(data)
    const updated = await updateActivity(doc._id.toString(), filtered)

    if (!updated) {
      return NextResponse.json({ error: 'activity not found' }, { status: 404 })
    }

    return NextResponse.json({ activity: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function filterData(data: Partial<ActivityData>) {
  const parsed = parseData(data)
  return _.pickBy(parsed, [
    'title',
    'description',
    'details.externalLink',
    'setting.data.maxTotalScore',
    'setting.data.minFollowers',
    'published',
  ])
}
