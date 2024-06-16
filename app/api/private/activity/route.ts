import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { getAllActivity } from '@/lib/db/activity'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const activities = await getAllActivity()

    return NextResponse.json({ activities })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
