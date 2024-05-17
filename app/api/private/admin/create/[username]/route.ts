import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { createAdmin } from '@/lib/db/admin'
import { getUserByUsername } from '@/lib/db/user'

export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    // TODO: check has authentication
    const token = await getToken({ req })

    await dbConnect()

    const { username } = params
    const user = await getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { role } = await req.json()

    const admin = await createAdmin(user._id.toString(), role)

    return NextResponse.json({ admin })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
