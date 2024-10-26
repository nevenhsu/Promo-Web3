import { Group, Stack, Paper, Text, Avatar } from '@mantine/core'
import type { PaperProps } from '@mantine/core'

type TokenProps = {
  symbol: string
  name: string
  icon: string
  amount: string
  paperProps?: PaperProps
}

export default function Token(props: TokenProps) {
  const { symbol, name, icon, amount, paperProps } = props

  return (
    <Paper radius="md" p="md" shadow="xs" {...paperProps}>
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

        <Text fw={500} lh={1}>
          {amount}
        </Text>
      </Group>
    </Paper>
  )
}
