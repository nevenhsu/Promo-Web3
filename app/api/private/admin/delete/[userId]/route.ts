import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { deleteAdmin } from '@/lib/db/admin'

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = await params

    await dbConnect()

    const admin = await deleteAdmin(userId)

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
