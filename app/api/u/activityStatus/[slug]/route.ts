import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAfter } from 'date-fns'
import dbConnect from '@/lib/dbConnect'
import { getUserActivityStatus, updateUserActivityStatus } from '@/lib/db/userActivityStatus'
import { getActivityBySlug } from '@/lib/db/activity'
import { ActivityStatus } from '@/types/db'

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

    if (!doc) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const status = await getUserActivityStatus(userId, doc._id.toString())

    return NextResponse.json({ status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Set userActivityStatus to initial
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!
    const { slug } = params

    await dbConnect()

    const activity = await getActivityBySlug(slug)

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    if (isAfter(new Date(), activity.endTime)) {
      return NextResponse.json({ error: 'Activity has ended' }, { status: 400 })
    }

    const activityId = activity._id.toString()

    // Check if activity status is not completed, waitList, or initial
    const doc = await getUserActivityStatus(userId, activityId)
    const skipStatus = [ActivityStatus.Completed, ActivityStatus.WaitList, ActivityStatus.Initial]
    if (doc && _.includes(skipStatus, doc.status)) {
      return NextResponse.json({ status: doc })
    }

    // Update status to initial
    const status = await updateUserActivityStatus(userId, activityId, {
      status: ActivityStatus.Initial,
      socialMedia: activity.socialMedia,
    })
    return NextResponse.json({ status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
