import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getAllAdmins } from '@/lib/db/admin'

export async function GET(req: NextRequest) {
  try {
    // TODO: check has authentication
    const token = await getToken({ req })

    await dbConnect()

    const admins = await getAllAdmins()

    return NextResponse.json({ admins })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
