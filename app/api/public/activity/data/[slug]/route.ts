import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { getPublicActivityDetails } from '@/lib/db/activity'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    await dbConnect()

    const details = await getPublicActivityDetails(slug)

    if (!details) {
      return NextResponse.json({ error: 'Activity data not found' }, { status: 404 })
    }

    return NextResponse.json({ details })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
