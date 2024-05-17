import { NextResponse, type NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { updateUserById } from '@/lib/db/user'

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const data = await req.json()

    await dbConnect()

    const user = await updateUserById(userId, data)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
