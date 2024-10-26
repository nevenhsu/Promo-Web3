import Decimal from 'decimal.js'
import { Group, Stack, Paper, Text, Avatar } from '@mantine/core'
import { formatFixedNumber } from '@/utils/math'

type TokenProps = {
  symbol: string
  name: string
  icon: string
  decimal: number
  balance?: bigint // in smallest unit
  price?: Decimal
}

export default function Token(props: TokenProps) {
  const { symbol, name, icon, balance, price, decimal } = props

  const bal = Decimal.div(balance?.toString() || 0, 10 ** decimal)
  const p = price ? price.mul(bal) : undefined

  return (
    <Paper radius="md" p="md" shadow="xs">
      <Group justify="space-between">
        <Group>
          <Avatar src={icon} size={32} alt="" />

          <Stack gap={4}>
            <Text fw={500} lh={1}>
              {name}
            </Text>
            <Text fz="xs" c="dimmed" lh={1}>
              {symbol}
            </Text>
          </Stack>
        </Group>
        <Stack gap={4} ta="right">
          <Text fw={500} lh={1}>
            {formatFixedNumber(bal, 6)}
          </Text>
          <Text fz="xs" c="dimmed" lh={1}>
            {p ? `USD ${formatFixedNumber(p, 2)}` : 'No price yet'}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}
