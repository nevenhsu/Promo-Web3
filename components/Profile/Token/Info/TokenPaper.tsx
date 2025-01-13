import { Avatar, Group, Paper, Stack, Text } from '@mantine/core'

type TokenPaperProps = {
  name: string
  symbol: string
  icon?: string | null
  leftSection?: React.ReactNode
}

export default function TokenPaper(props: TokenPaperProps) {
  const { name, symbol, icon, leftSection } = props
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

        {leftSection ? <>{leftSection}</> : null}
      </Group>
    </Paper>
  )
}
