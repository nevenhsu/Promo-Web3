import { isAfter } from 'date-fns'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { updateEpoch, getEpoch } from '@/lib/db/epoch'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ index: string }> }) {
  try {
    const { index } = await params
    const i = parseInt(index)

    await dbConnect()

    const epoch = await getEpoch(i)

    if (epoch && isAfter(new Date(), epoch.endTime)) {
      return NextResponse.json({ error: 'You can not update the past epoch' }, { status: 400 })
    }

    const data = await req.json()

    const updated = await updateEpoch(i, data)

    if (!updated) {
      return NextResponse.json({ error: 'Epoch not found' }, { status: 404 })
    }

    return NextResponse.json({ epoch: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
