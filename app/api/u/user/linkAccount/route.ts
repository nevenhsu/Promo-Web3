import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { updateLinkAccount, removeLinkAccount } from '@/lib/db/user'
import { LinkAccountPlatform } from '@/types/db'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const _id = token?.user?.id!

    const data = await req.json()
    const { platform, username, userId } = data

    await dbConnect()

    // Check if platform is valid
    if (!_.includes(LinkAccountPlatform, platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const user = await updateLinkAccount(_id, { userId, platform, username })

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const _id = token?.user?.id!

    const data = await req.json()
    const { platform } = data

    await dbConnect()

    // Check if platform is valid
    if (!_.includes(LinkAccountPlatform, platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const user = await removeLinkAccount(_id, platform)

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
