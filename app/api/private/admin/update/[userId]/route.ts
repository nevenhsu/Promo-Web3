import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { updateUserById } from '@/lib/db/admin'

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const data = await req.json()

    await dbConnect()

    const admin = await updateUserById(userId, data)

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
