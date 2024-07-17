import Decimal from 'decimal.js'
import numeral from 'numeral'

export function formatBalance(balance: Decimal.Value | bigint, decimal: number) {
  const bal = new Decimal(balance.toString())
  return bal.div(new Decimal(10).pow(decimal))
}

export function formatAmount(balance: Decimal.Value | bigint, decimal: number) {
  const bal = new Decimal(balance.toString())
  return bal.mul(new Decimal(10).pow(decimal))
}

export function formatNumber(num: number | string) {
  return numeral(num).format('0,0.[00]a')
}
