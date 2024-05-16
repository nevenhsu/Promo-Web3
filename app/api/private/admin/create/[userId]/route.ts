import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { createAdmin } from '@/lib/db/admin'

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // TODO: check has authentication
    const token = await getToken({ req, secret: process.env.AUTH_SECRET })

    const { userId } = params
    const { role } = await req.json()

    await dbConnect()

    const admin = await createAdmin(userId, role)

    return NextResponse.json({ admin })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
