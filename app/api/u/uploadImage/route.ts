import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { uploadImage } from '@/lib/gcp'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const { dataURI, name } = await req.json()

    if (!userId || !dataURI || !name) {
      return NextResponse.json({ error: 'invalid params' }, { status: 400 })
    }

    const path = `images/${userId}`
    const fileName = `${userId}-${name}`
    const url = await uploadImage(dataURI, path, fileName)

    return NextResponse.json({ url })
  } catch (error) {
    console.error(error)

    if (error instanceof Error && error.message.includes('10mb')) {
      return NextResponse.json({ error: 'File size cannot exceed 10mb' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
