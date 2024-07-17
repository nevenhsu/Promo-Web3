import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserActivityStatus, updateUserActivityStatus } from '@/lib/db/userActivityStatus'
import { getActivityId } from '@/lib/db/activity'
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
    const activityId = await getActivityId(slug)

    if (!activityId) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const status = await getUserActivityStatus(userId, activityId)

    return NextResponse.json({ status })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    await dbConnect()
    const activityId = await getActivityId(slug)

    if (!activityId) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    // Check if activity is already completed
    const doc = await getUserActivityStatus(userId, activityId)
    if (doc && doc.status === ActivityStatus.Completed) {
      return NextResponse.json({ status: doc })
    }

    // Update status to initial
    const status = await updateUserActivityStatus(userId, activityId, ActivityStatus.Initial)
    return NextResponse.json({ status })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
