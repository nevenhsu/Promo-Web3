import Decimal from 'decimal.js'
import numeral from 'numeral'

export function formatBalance(rawAmount: Decimal.Value | bigint, decimal: number) {
  // ex: 1000000000000000000 => 1
  const amount = new Decimal(rawAmount.toString()).floor()
  return amount.div(new Decimal(10).pow(decimal))
}

export function formatAmount(displayAmount: Decimal.Value | bigint, decimal: number) {
  // ex: 1 => 1000000000000000000
  const amount = new Decimal(displayAmount.toString())
  return amount.mul(new Decimal(10).pow(decimal)).floor()
}

export function formatNumber(num: number | string) {
  return numeral(num).format('0,0.[00]a')
}
