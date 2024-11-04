import { isAfter } from 'date-fns'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { deleteEpoch, getLastEpoch } from '@/lib/db/epoch'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ index: string }> }) {
  try {
    const { index } = await params
    const i = parseInt(index)

    await dbConnect()

    const [lastEpoch] = await getLastEpoch()

    if (lastEpoch && lastEpoch.index !== i) {
      return NextResponse.json({ error: 'You can only delete the last epoch' }, { status: 400 })
    }

    if (lastEpoch && isAfter(new Date(), lastEpoch.startTime)) {
      return NextResponse.json({ error: 'You can only delete the future epoch' }, { status: 400 })
    }

    const epoch = await deleteEpoch(i)

    if (!epoch) {
      return NextResponse.json({ error: 'Epoch not found' }, { status: 404 })
    }

    return NextResponse.json({ epoch })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
