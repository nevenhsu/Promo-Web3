'use client'

import { Link } from '@/i18n/routing'
import { Title, Stack, Space, Paper, Group, Divider } from '@mantine/core'
import { Text, Avatar, Button, ThemeIcon, Box } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useUserToken } from '@/store/contexts/app/userToken'
import { PiRocketLaunch, PiHandHeart } from 'react-icons/pi'

export default function Token() {
  const { data, loading } = useUserToken()
  const { tokens = [] } = data || {}

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Token</Title>

          {/* Contents */}
          <Stack gap={24}>
            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Reward community
                </Title>
                <Text size="sm" c="dimmed">
                  Airdrop tokens to participants joining your activities
                </Text>
              </Box>
            </Group>

            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiHandHeart size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Reward donors
                </Title>
                <Text size="sm" c="dimmed">
                  Airdrop tokens to donors supporting your donation campaigns
                </Text>
              </Box>
            </Group>

            <Box ta="center">
              <Link href="/profile/token/info">
                <Button size="md" loading={loading}>
                  Create new token
                </Button>
              </Link>
            </Box>

            <Divider />
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
