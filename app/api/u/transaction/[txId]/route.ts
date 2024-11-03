import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserTransaction } from '@/lib/db/transaction'

export async function GET(req: NextRequest, { params }: { params: { txId: string } }) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    const { txId } = await params

    if (!txId) {
      return NextResponse.json({ error: 'TxId is required' }, { status: 400 })
    }

    await dbConnect()
    const tx = await getUserTransaction(userId, txId)

    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json({ tx })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
