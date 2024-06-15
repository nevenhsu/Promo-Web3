import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { createActivity } from '@/lib/db/activity'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const data = await req.json()

    // Validate input
    if (!data.startTime || !data.endTime) {
      return NextResponse.json({ error: 'startTime and endTime are required' }, { status: 400 })
    }

    if (!data.activityType || !data.socialMedia) {
      return NextResponse.json(
        { error: 'activityType and socialMedia are required' },
        { status: 400 }
      )
    }

    const activity = await createActivity(data)

    return NextResponse.json({ activity })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
