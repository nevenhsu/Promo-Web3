import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { getAllAdmins } from '@/lib/db/admin'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const admins = await getAllAdmins()

    return NextResponse.json({ admins })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
