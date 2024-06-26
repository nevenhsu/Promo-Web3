import Decimal from 'decimal.js'

export function formatBalance(balance: Decimal.Value | bigint, decimal: number) {
  const bal = new Decimal(balance.toString())
  return bal.div(new Decimal(10).pow(decimal))
}

export function formatAmount(balance: Decimal.Value | bigint, decimal: number) {
  const bal = new Decimal(balance.toString())
  return bal.mul(new Decimal(10).pow(decimal))
}
