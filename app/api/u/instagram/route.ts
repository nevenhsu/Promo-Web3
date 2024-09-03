import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import InstagramModel from '@/models/instagram'
import { getLongLivedAccessToken, getMe } from '@/lib/instagram'
import { updateLinkAccount } from '@/lib/db/user'
import { LinkAccountPlatform } from '@/types/db'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { accessToken } = await req.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 400 })
    }

    const { longLivedAccessToken, expiredAt } = await getLongLivedAccessToken(accessToken)
    const { id, username } = await getMe(longLivedAccessToken)

    await dbConnect()

    // update access token
    const instagram = await InstagramModel.findOneAndUpdate(
      { _user: userId },
      { uid: id, accessToken: longLivedAccessToken, expiredAt, refreshAt: new Date() },
      { upsert: true, new: true }
    )

    // update user linked instagram
    const user = await updateLinkAccount(userId, {
      subject: id,
      platform: LinkAccountPlatform.Instagram,
      username,
      userId: '',
    })

    return NextResponse.json({ instagram, user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
