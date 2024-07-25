import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { getAllEpochs } from '@/lib/db/epoch'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const epochs = await getAllEpochs()

    return NextResponse.json({ epochs })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
