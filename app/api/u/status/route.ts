import * as _ from 'lodash-es'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import dbConnect from '@/lib/dbConnect'
import { getUserStatus } from '@/lib/db/userStatus'
import { getAllAirdrops } from '@/lib/db/airdrop'
import { countUserActivityStatus, getOngoingActivityStatuses } from '@/lib/db/userActivityStatus'
import type { TUserActivityStatusData } from '@/models/userActivityStatus'

// Get the status of the current user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    const userId = token?.user?.id!

    await dbConnect()

    const status = await getUserStatus(userId)
    const airdropData = await getAllAirdrops(userId)
    const finalized = await countUserActivityStatus(userId, true)
    const onGoingStatuses = await getOngoingActivityStatuses(userId)
    const ongoing = onGoingStatuses.length // count

    // Calculate unsettled airdrops
    const unsettledAirDrops = calcUnsettledAirdrops(onGoingStatuses)
    const unsettledSymbols = Object.keys(unsettledAirDrops)
    const airdropSymbols = airdropData.map(({ symbol }) => symbol)
    const symbols = _.uniq([...unsettledSymbols, ...airdropSymbols])

    // Combine airdrop data with unsettled airdrops
    const airdrops = symbols.map(symbol => {
      const airdrop = airdropData.find(({ symbol: airdropSymbol }) => airdropSymbol === symbol)
      const { receivedAmount, pendingAmount } = airdrop || {}
      const unsettledAmount = unsettledAirDrops[symbol] || 0
      return { symbol, receivedAmount, pendingAmount, unsettledAmount }
    })

    const total = finalized + ongoing
    const progress = { total, finalized, ongoing }

    return NextResponse.json({ status, airdrops, progress })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calcUnsettledAirdrops(onGoingStatuses: TUserActivityStatusData[]) {
  const unsettled = onGoingStatuses.map(data => {
    const { _activity } = data
    const { details, airdrop } = _activity
    // Calculate airdrop share
    const airdropShare = data.totalScore / details.totalScore || 0
    const unsettledAmount = airdropShare * Number(airdrop.amount) || 0
    return { symbol: airdrop.symbol, unsettledAmount }
  })
  const unsettledAirDrops = _.reduce(
    unsettled,
    (acc, { symbol, unsettledAmount }) => {
      if (acc[symbol]) {
        acc[symbol] += unsettledAmount
      } else {
        acc[symbol] = unsettledAmount
      }
      return acc
    },
    {} as { [symbol: string]: number }
  )
  return unsettledAirDrops
}
