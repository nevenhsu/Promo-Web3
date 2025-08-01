import { Link } from '@/i18n/routing'
import { Avatar, Group, Paper, Stack, Text } from '@mantine/core'
import { formatFixedNumber } from '@/utils/math'
import classes from './index.module.css'
import type { TTokenWithUser } from '@/models/token'

type TokenPaperProps = {
  data: TTokenWithUser
  ranking: number
}

export default function UserPaper(props: TokenPaperProps) {
  const { data, ranking } = props
  const { _user, totalBalance } = data
  const { name, username, details } = _user

  return (
    <Link href={{ pathname: '/u/[username]', params: { username } }}>
      <Paper radius="md" p="md" className={classes.paper}>
        <Group justify="space-between">
          <Group>
            <Avatar src={details.avatar} name={username} color="initials" size={40}>
              {' '}
            </Avatar>

            <Stack gap={4}>
              <Text fw={500} lh={1}>
                {name || '-'}
              </Text>
              <Text fz="xs" c="dimmed" lh={1}>
                {`@${username}`}
              </Text>
            </Stack>
          </Group>

          <Stack gap={4} ta="right">
            <Text fw={500} lh={1} c="orange">
              {`#${ranking}`}
            </Text>
            <Text fz="xs" c="dimmed" lh={1}>
              {formatFixedNumber(totalBalance)}
            </Text>
          </Stack>
        </Group>
      </Paper>
    </Link>
  )
}
