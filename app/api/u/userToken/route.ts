import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { isImageURI, uploadImage } from '@/lib/gcp'
import { getUserTokens, updateUserToken } from '@/lib/db/userToken'

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

    await dbConnect()

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

    const userToken = await updateUserToken(docId, _.omitBy(data, _.isEmpty))

    return NextResponse.json({ userToken })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
