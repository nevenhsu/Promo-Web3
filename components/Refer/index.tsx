'use client'

import { useAppSelector } from '@/hooks/redux'
import { Link } from '@/navigation'
import { Space, Divider, Stack, Group, Box, Paper } from '@mantine/core'
import { ThemeIcon, Text, Title, Button, CopyButton } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiRocketLaunch } from 'react-icons/pi'

export default function Refer() {
  const { referralData } = useAppSelector(state => state.user)
  const { code } = referralData || {}

  const getPromoLink = (code: string) => {
    return `${window.location.origin}/?promo=${code}`
  }

  return (
    <>
      <RwdLayout>
        <Space h={16} />

        <Stack gap="xl">
          <Title order={3} ta="center">
            Invite Friends
            <br />
            Earn bonus score!
          </Title>

          <Divider />

          {/* Contents */}
          <Stack gap={24}>
            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Invite your friends
                </Title>
                <Text size="sm" c="dimmed">
                  Refer your friends & earn up to 10% bonus every time they gain score
                </Text>
              </Box>
            </Group>

            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Earn more bonus score
                </Title>
                <Text size="sm" c="dimmed">
                  Earn up to 1% bonus every time your friends’ friends gain score
                </Text>
              </Box>
            </Group>
          </Stack>

          {/* Link */}
          <Paper p="xs" ta="center" c="orange" bd="1px dashed red">
            <Text fz="sm" fw={500}>
              {code ? getPromoLink(code) : 'Loading...'}
            </Text>
          </Paper>

          {/* Actions */}
          <Stack gap={24}>
            <CopyButton value={code ? getPromoLink(code) : ''}>
              {({ copied, copy }) => (
                <Button size="md" onClick={copy} loading={!code}>
                  {copied ? 'Copied' : 'Copy my invite link'}
                </Button>
              )}
            </CopyButton>

            <Link href="/refer/list">
              <Button size="md" variant="outline" w="100%" color="dark">
                View my friends
              </Button>
            </Link>
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
