import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { deleteAdmin } from '@/lib/db/admin'

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // TODO: check has authentication
    const token = await getToken({ req, secret: process.env.AUTH_SECRET })

    const { userId } = params

    await dbConnect()

    const admin = await deleteAdmin(userId)

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
