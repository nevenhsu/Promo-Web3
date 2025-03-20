import Decimal from 'decimal.js'
import numeral from 'numeral'

/** To base unit, ex: 1000000000000000000 => 1 */
export function formatBalance(rawAmount: Decimal.Value | bigint, decimal: number) {
  const amount = new Decimal(rawAmount.toString()).floor()
  return amount.div(new Decimal(10).pow(decimal))
}

/** To wei, ex: 1 => 1000000000000000000 */
export function formatAmount(displayAmount: Decimal.Value | bigint, decimal: number) {
  const amount = new Decimal(displayAmount.toString())
  return amount.mul(new Decimal(10).pow(decimal)).floor()
}

export function formatNumber(num: number | string) {
  return numeral(num).format('0,0.[00]a')
}

export function formatPercent(num: number | string) {
  return numeral(num).format('0.00%')
}

export function formatFixedNumber(val: Decimal.Value | bigint, fixed?: number) {
  const str = new Decimal(val.toString()).toFixed(fixed)
  const num = str.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.0+$/, '')
  return numeral(num).format(`0,0.[${'0'.repeat(fixed || 0)}]`)
}
