import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getExistingTokens } from '@/lib/db/userToken'
import { banNames, banSymbols } from '@/contracts/variables'
import { cleanSymbol, cleanName } from '@/utils/helper'
import { getPublicClient } from '@/wallet/lib/publicClients'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getToken({ req })
    const userId = jwt?.user?.id!

    const { searchParams } = new URL(req.url)
    const name = cleanName(searchParams.get('name') || '')
    const symbol = cleanSymbol(searchParams.get('symbol') || '')
    const chainId = parseInt(searchParams.get('chainId') || '0')
    const client = getPublicClient(chainId)

    if (!name || !symbol || !chainId) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    if (!client) {
      return NextResponse.json({ error: 'Unsupported chain' }, { status: 400 })
    }

    // check if name or symbol is banned
    if ([...banNames, ...banSymbols].includes(name.toLowerCase())) {
      return NextResponse.json({ error: 'Name is banned' }, { status: 400 })
    }

    if (banSymbols.includes(symbol.toLowerCase())) {
      return NextResponse.json({ error: 'Symbol is banned' }, { status: 400 })
    }

    await dbConnect()

    // check if token is not minted or owned by the user
    const tokens = await getExistingTokens({ name, symbol, chainId })
    for (const token of tokens) {
      if (token.name === name) {
        return NextResponse.json({ error: 'Name is taken' }, { status: 400 })
      }
      if (token.symbol === symbol) {
        return NextResponse.json({ error: 'Symbol is taken' }, { status: 400 })
      }
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
