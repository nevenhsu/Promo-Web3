import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { isImageURI, uploadImage } from '@/lib/gcp'
import { updateUserById, getUserByUsername } from '@/lib/db/user'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { name, username, avatarURI, coverURI, bio = '', link = '' } = await req.json()

    await dbConnect()

    // Check if username already exists
    if (username) {
      const existUser = await getUserByUsername(username)
      if (existUser && existUser._id.toString() !== userId) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
      }
    }

    let details: { [k: string]: string } = {
      bio,
      link,
    }

    // upload image to GCP
    if (isImageURI(avatarURI)) {
      const path = `images/${userId}`
      const fileName = 'avatar'
      const url = await uploadImage(avatarURI, path, fileName, { width: 200, height: 200 })
      if (!url) {
        return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
      }
      details.avatar = url
    }

    if (isImageURI(coverURI)) {
      const path = `images/${userId}`
      const fileName = 'cover'
      const url = await uploadImage(coverURI, path, fileName, { width: 1400, height: 350 })
      if (!url) {
        return NextResponse.json({ error: 'Failed to upload cover' }, { status: 500 })
      }
      details.cover = url
    }

    const user = await updateUserById(userId, {
      name,
      username,
      details,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: _.get(error, 'message', 'Internal server error') },
      { status: 500 }
    )
  }
}
