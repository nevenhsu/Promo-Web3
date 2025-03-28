import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { parseData } from '@/lib/db/common'
import { updateActivity } from '@/lib/db/activity'
import type { ActivityData } from '@/models/activity'

// body: { data, details }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await dbConnect()

    const { data } = await req.json()
    const parsed = parseData(data)

    const updated = await updateActivity(id, filterData(parsed))

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
    '_user',
    'nft',
    'details.participants',
    'details.totalScore',
    'airdrop._userToken',
    'airdrop.finalized',
  ])
}
