import Image from 'next/image'
import { Group, Stack, Paper, Text } from '@mantine/core'
import { formatFixedNumber } from '@/utils/math'

type TokenProps = {
  symbol: string
  name: string
  icon: string
  received?: string
  pending?: string
}

export default function Token(props: TokenProps) {
  const { symbol, name, icon, received, pending } = props

  return (
    <Paper radius="md" p="md" shadow="xs">
      <Group justify="space-between">
        <Group>
          <Image
            src={icon || '/icons/token.svg'}
            width={32}
            height={32}
            alt=""
            style={{
              borderRadius: 100,
              overflow: 'hidden',
            }}
          />

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
            {formatFixedNumber(received || 0, 6)}
          </Text>
          <Text fz="xs" c="dimmed" lh={1}>
            {`Pending: ${formatFixedNumber(pending || 0, 6)}`}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}
