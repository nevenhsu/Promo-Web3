import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { getPublicActivitiesTotal } from '@/lib/db/activity'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const ongoing = await getPublicActivitiesTotal(true)
    const past = await getPublicActivitiesTotal(false)

    return NextResponse.json({ ongoing, past })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
