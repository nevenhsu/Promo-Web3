import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { createEpoch } from '@/lib/db/epoch'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { startTime, endTime } = await req.json()

    // Validate input
    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'startTime and endTime are required' }, { status: 400 })
    }

    const epoch = await createEpoch(startTime, endTime)

    return NextResponse.json({ epoch })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
