import { isAfter } from 'date-fns'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { updateEpoch, getEpoch } from '@/lib/db/epoch'

export async function PUT(req: NextRequest, { params }: { params: { index: string } }) {
  try {
    const index = parseInt(params.index)

    await dbConnect()

    const epoch = await getEpoch(index)

    if (epoch && isAfter(new Date(), epoch.endTime)) {
      return NextResponse.json({ error: 'You can not update the past epoch' }, { status: 400 })
    }

    const data = await req.json()

    const updated = await updateEpoch(index, data)

    if (!updated) {
      return NextResponse.json({ error: 'Epoch not found' }, { status: 404 })
    }

    return NextResponse.json({ epoch: updated })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
