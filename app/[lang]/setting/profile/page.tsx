import TitleBar from '@/components/TitleBar'
import { Paper, Stack, Group, Text } from '@mantine/core'
import LinkButton from '@/components/LinkButton'

export default function Profile() {
  return (
    <>
      <TitleBar title="Profile" />

      <Stack gap="xs" mb="xl">
        <Text c="gray" fz={12} pl={16}>
          Basic
        </Text>
        <Paper py={16}>
          <Stack>
            <LinkButton href="/setting/profile/name">
              <Group gap="xs">Name</Group>
            </LinkButton>
            <LinkButton href="/setting/profile/username">
              <Group gap="xs">Username</Group>
            </LinkButton>
            <LinkButton href="/setting/profile/about">
              <Group gap="xs">About</Group>
            </LinkButton>
            <LinkButton href="/setting/profile/link">
              <Group gap="xs">Link</Group>
            </LinkButton>
          </Stack>
        </Paper>
      </Stack>
      <Stack gap="xs" mb="xl">
        <Text c="gray" fz={12} pl={16}>
          Picture
        </Text>
        <Paper py={16}>
          <Stack>
            <LinkButton href="/setting/profile/avatar">
              <Group gap="xs">Avatar</Group>
            </LinkButton>
            <LinkButton href="/setting/profile/covers">
              <Group gap="xs">Covers</Group>
            </LinkButton>
          </Stack>
        </Paper>
      </Stack>
    </>
  )
}
