import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { differenceInDays } from 'date-fns'
import dbConnect from '@/lib/dbConnect'
import InstagramModel from '@/models/instagram'
import UserModel from '@/models/user'
import { refreshAccessToken, getMe } from '@/lib/instagram'
import { LinkAccountPlatform } from '@/types/db'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const doc = await InstagramModel.findOne({ _user: userId }).lean()
    const userDoc = await UserModel.findById(userId).lean()

    if (!doc || !userDoc) {
      return NextResponse.json({ error: 'Data not found' }, { status: 400 })
    }

    const linkedAccount = userDoc.linkedAccounts.find(
      o => o.platform === LinkAccountPlatform.Instagram
    )

    if (linkedAccount?.subject !== doc.uid) {
      return NextResponse.json({ error: 'Instagram not linked' }, { status: 400 })
    }

    const { accessToken, expiredAt } = doc
    const { id, username } = await getMe(accessToken)

    await dbConnect()

    // update user linked instagram
    const user = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        'linkedAccounts.platform': LinkAccountPlatform.Instagram,
        'linkedAccounts.subject': id,
      },
      {
        $set: {
          'linkedAccounts.$.username': username,
        },
      },
      { new: true }
    )

    const now = new Date()
    const diffDays = differenceInDays(new Date(), expiredAt)

    // at least 24 hours before the token expires
    if (diffDays >= 1 && diffDays <= 3) {
      const { expiredAt: newExpiredAt, longLivedAccessToken } =
        await refreshAccessToken(accessToken)

      const instagram = await InstagramModel.findOneAndUpdate(
        { _user: userId },
        { accessToken: longLivedAccessToken, expiredAt: newExpiredAt, refreshAt: now },
        { new: true }
      )

      return NextResponse.json({ user, instagram })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
