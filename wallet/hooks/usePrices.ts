'use client'

import * as _ from 'lodash-es'
import axios from 'axios'
import Decimal from 'decimal.js'
import { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { symbols } from '@/contracts/tokens'

type PriceData = {
  symbol: string // "LTCBTC",
  price: string // "4.00000200"
}

const baseUrl = 'https://api.binance.com'
const baseToken = 'USDT'
const validTokens = _.intersection(symbols, ['ETH', 'USDC'])

export function usePrices() {
  const [priceState, updatePrice] = useAsyncFn(async () => {
    const { data } = await fetchPrices()

    const prices: { [symbol: string]: Decimal | undefined } = {}

    data.forEach(o => {
      const symbol = o.symbol.replace(baseToken, '')
      prices[symbol] = new Decimal(o.price)
    })

    return prices
  }, [])

  useEffect(() => {
    updatePrice()
  }, [])

  const prices = priceState.value || { USDC: new Decimal(1) }
  return { prices, updatePrice, loading: priceState.loading }
}

async function fetchPrices() {
  const val = validTokens.map(o => `${o}${baseToken}`)
  const url = `${baseUrl}/api/v3/ticker/price?symbols=${JSON.stringify(val)}`
  return axios.get<PriceData[]>(url)
}
