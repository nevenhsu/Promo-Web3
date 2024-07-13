import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { updateActivity } from '@/lib/db/activity'

// body: { data, details }
export async function PUT(req: NextRequest, { params }: { params: { index: string } }) {
  try {
    const index = parseInt(params.index)

    await dbConnect()

    const { data, details, airdrop } = await req.json()

    const updated = await updateActivity(index, data, details, airdrop)

    if (!updated) {
      return NextResponse.json({ error: 'activity not found' }, { status: 404 })
    }

    return NextResponse.json({ activity: updated })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
