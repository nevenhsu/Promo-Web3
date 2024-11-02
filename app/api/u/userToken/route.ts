import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { isImageURI, uploadImage } from '@/lib/gcp'
import { getUserToken, updateUserToken } from '@/lib/db/userToken'
import { getTokens } from '@/lib/db/token'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    await dbConnect()
    const userToken = await getUserToken(userId)
    const tokens = userToken ? await getTokens(userToken._id.toString()) : []

    return NextResponse.json({ userToken, tokens })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!
    const { walletAddr, name, symbol, icon, iconURI } = await req.json()

    const data = {
      name,
      symbol,
      icon,
    }

    // upload image to GCP
    if (isImageURI(iconURI)) {
      const path = `images/${userId}`
      const fileName = 'token-cover'
      const url = await uploadImage(iconURI, path, fileName, { width: 80, height: 80 })
      if (!url) {
        return NextResponse.json({ error: 'Failed to upload token cover' }, { status: 500 })
      }
      data.icon = url
    }

    await dbConnect()
    const userToken = await updateUserToken(userId, _.omitBy(data, _.isEmpty), walletAddr)

    return NextResponse.json({ userToken })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
