import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { getAllActivity } from '@/lib/db/activity'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const epochs = await getAllActivity()

    return NextResponse.json({ epochs })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
