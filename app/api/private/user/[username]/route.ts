import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserByUsername } from '@/lib/db/user'

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    // TODO: check has authentication
    const token = await getToken({ req })

    const { username } = params

    await dbConnect()

    const user = await getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
