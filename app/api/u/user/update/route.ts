import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { updateUserById, getUserByUsername } from '@/lib/db/user'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const data = await req.json()
    const updateData = getUpdateData(data)

    await dbConnect()

    if (updateData.username) {
      const existUser = await getUserByUsername(updateData.username)
      if (existUser && existUser._id.toString() !== userId) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
      }
    }

    const user = await updateUserById(userId, updateData)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getUpdateData(data: any) {
  const updateData = _.pick(data, ['username', 'name'])
  return updateData
}
