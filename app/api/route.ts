import * as _ from 'lodash-es'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const msg = `Hello!`
  return NextResponse.json({ success: true, msg })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    const error = _.get(err, 'message', 'failed')
    return NextResponse.json({ success: false, error })
  }
}
