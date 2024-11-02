import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserToken } from '@/lib/db/userToken'
import { saveToken } from '@/lib/db/token'

export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!
    const { chainId } = await req.json()

    await dbConnect()

    const userToken = await getUserToken(userId)

    if (!userToken || !userToken.name || !userToken.symbol) {
      return NextResponse.json({ error: 'User token not found' }, { status: 404 })
    }

    const token = await saveToken(userToken, chainId)

    return NextResponse.json({ token })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
