import _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { updateActivity } from '@/lib/db/activity'
import type { ActivityData } from '@/models/activity'

// body: { data, details }
export async function PUT(req: NextRequest, { params }: { params: { index: string } }) {
  try {
    const index = parseInt(params.index)

    await dbConnect()

    const { data } = await req.json()

    const updated = await updateActivity(index, filterData(data))

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
  return _.omit(data, [
    'index',
    'details.participants',
    'details.totalScore',
    'airdrop.finalized',
    'bonus.finalized',
  ])
}
