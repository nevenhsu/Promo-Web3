import { Paper, Box, Group, Text, Title, ThemeIcon, ActionIcon } from '@mantine/core'
import { PiRocketLaunch, PiCaretRight } from 'react-icons/pi'

export function ReferralCard() {
  return (
    <Paper p="md" shadow="xs">
      <Group justify="space-between" wrap="nowrap">
        <Group wrap="nowrap" gap={20}>
          <ThemeIcon size="lg" radius="sm">
            <PiRocketLaunch size={24} />
          </ThemeIcon>
          <Box>
            <Title order={5} fw={500}>
              Earn more score
            </Title>
            <Text size="xs" c="dimmed">
              Share with friends & earn up to 10% score every time your friends gain
            </Text>
          </Box>
        </Group>
        <ActionIcon color="dark">
          <PiCaretRight size={20} />
        </ActionIcon>
      </Group>
    </Paper>
  )
}
