import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserTokens, updateUserToken, getUserToken, uploadTokenIcon } from '@/lib/db/userToken'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()
    const tokens = await getUserTokens(userId)

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const json = await req.json()
    const userId = jwt?.user?.id!
    const { docId, icon, iconURI } = json

    const data = {
      icon,
    }

    if (!docId) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 })
    }

    await dbConnect()

    const doc = await getUserToken(docId)
    if (!doc || doc._user.toString() !== userId) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    // upload image to GCP
    const walletId = doc._wallet.toString()
    const url = await uploadTokenIcon(userId, walletId, iconURI)
    if (url) {
      data.icon = url
    }

    const token = await updateUserToken(docId, _.omitBy(data, _.isEmpty))

    return NextResponse.json({ token })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
