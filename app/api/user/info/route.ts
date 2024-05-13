import * as _ from 'lodash-es'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/user'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const userId = _.get(token, 'user.id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    const user = await UserModel.findById(userId).exec()

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
