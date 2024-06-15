import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { deleteActivity } from '@/lib/db/activity'

export async function DELETE(req: NextRequest, { params }: { params: { index: string } }) {
  try {
    const index = parseInt(params.index)

    await dbConnect()

    const activity = await deleteActivity(index)

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    return NextResponse.json({ activity })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
