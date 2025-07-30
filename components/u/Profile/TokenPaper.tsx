import { Avatar, Group, Paper, Stack, Text } from '@mantine/core'
import { formatFixedNumber } from '@/utils/math'

type TokenPaperProps = {
  data: { name: string; symbol: string; icon?: string | null }
  balance?: string
}

export default function TokenPaper(props: TokenPaperProps) {
  const { data, balance } = props
  const { name, symbol, icon } = data
  return (
    <Paper radius="md" p="md" shadow="xs">
      <Group justify="space-between">
        <Group>
          <Avatar src={icon} name={''} color="initials" size={40}>
            {' '}
          </Avatar>

          <Stack gap={4}>
            <Text fw={500} lh={1}>
              {name || 'Token Name'}
            </Text>
            <Text fz="xs" c="dimmed" lh={1}>
              {symbol || 'Token Symbol'}
            </Text>
          </Stack>
        </Group>

        {balance ? (
          <Text fw={500} lh={1}>
            {formatFixedNumber(balance)}
          </Text>
        ) : null}
      </Group>
    </Paper>
  )
}
