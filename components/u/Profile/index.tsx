'use client'

import { useDisclosure } from '@mantine/hooks'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import { Link } from '@/i18n/routing'
import { Space, Group, Stack, Box, AspectRatio, Paper } from '@mantine/core'
import { Avatar, Text, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import RwdModal from '@/components/share/RwdModal'
import TokenPaper from './TokenPaper'
import { PiRocket, PiGlobe, PiArrowSquareOut } from 'react-icons/pi'
import { PiCoinVertical, PiGear } from 'react-icons/pi'
import { FaXTwitter } from 'react-icons/fa6'
import { LinkAccountPlatform } from '@/types/db'
import type { TUser } from '@/models/user'
import type { TUserToken } from '@/models/userToken'
import type { TTokenWithUserToken } from '@/models/token'
import classes from './index.module.css'

enum Tab {
  Ranking = 'ranking',
  Activity = 'activity',
  Donate = 'donate',
}

const ThemeAction = ThemeIcon.withProps({
  variant: 'light',
  color: 'white',
  size: 'xl',
  radius: 'sm',
  mb: 'xs',
  bg: 'rgba(255,255,255,0.1)',
})

type UserProfileProps = {
  data: TUser
  userTokens: TUserToken[]
  tokens: TTokenWithUserToken[]
}

export default function UserProfile(props: UserProfileProps) {
  const { data, userTokens, tokens } = props

  // profile data
  const { name, username, details, linkedAccounts } = data
  const { bio, cover, avatar, link } = details || {}
  const profileId = data._id

  // auth data
  const [opened, { open, close }] = useDisclosure(false)
  const { fetched, data: userState } = useAppSelector(state => state.user)
  const isSelf = fetched && userState?._id === profileId

  const { chainId } = useWeb3()
  const creatorTokens = userTokens.filter(token => token.chainId === Number(chainId))

  // Get linked accounts
  const x = linkedAccounts?.find(account => account.platform === LinkAccountPlatform.X)

  return (
    <>
      <AspectRatio pos="relative" ratio={4 / 1}>
        {cover ? (
          <img
            src={cover}
            alt="cover"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box bg="gray.1" />
        )}
      </AspectRatio>

      <RwdLayout pt={0}>
        <Box mb={-16}>
          <Box
            pos="relative"
            bg="white"
            style={{
              top: -32,
              width: 64,
              borderRadius: '50%',
            }}
          >
            <Avatar src={avatar} name={name || username} color="initials" size={64} />
          </Box>
        </Box>

        <Stack gap="lg">
          <Stack>
            <Group justify="space-between">
              <Box>
                <Text fz="lg" fw={500}>
                  {name}
                </Text>
                <Text fz="xs" c="dimmed">
                  {`@${username}`}
                </Text>
              </Box>

              <Group className="c-pointer" onClick={open} wrap="nowrap">
                {x ? <FaXTwitter size={20} /> : null}

                {link ? <PiGlobe size={20} /> : null}
              </Group>
            </Group>

            <Text fz="sm" c="dimmed">
              {bio}
            </Text>
          </Stack>

          {isSelf ? (
            <Paper p="sm" c="white" shadow="xs" bg="var(--mantine-primary-color-5)">
              <Group className={classes.actions} grow>
                <Link href="/profile/token">
                  <ThemeAction>
                    <PiCoinVertical size={24} />
                  </ThemeAction>
                  <Text fz="sm">Token</Text>
                </Link>

                <Link href="/profile/activity">
                  <ThemeAction>
                    <PiRocket size={24} />
                  </ThemeAction>
                  <Text fz="sm">Activity</Text>
                </Link>

                <Link href="/profile/setting">
                  <ThemeAction>
                    <PiGear size={24} />
                  </ThemeAction>
                  <Text fz="sm">Setting</Text>
                </Link>
              </Group>
            </Paper>
          ) : null}

          {creatorTokens.length > 0 ? (
            <Stack gap="sm">
              <Text fz="sm" fw={500}>
                Created Tokens
              </Text>

              <Stack gap="xs">
                {creatorTokens.map(o => (
                  <Link
                    key={o._id}
                    href={{
                      pathname: '/token/[chain]/[symbol]',
                      params: { chain: `${o.chainId}`, symbol: o.symbol },
                    }}
                  >
                    <TokenPaper data={o} />
                  </Link>
                ))}
              </Stack>
            </Stack>
          ) : null}

          {tokens.length > 0 ? (
            <Stack gap="sm">
              <Text fz="sm" fw={500}>
                Held Tokens
              </Text>

              <Stack gap="xs">
                {tokens.map(o => (
                  <Link
                    key={o._id}
                    href={{
                      pathname: '/token/[chain]/[symbol]',
                      params: { chain: `${o._userToken.chainId}`, symbol: o._userToken.symbol },
                    }}
                  >
                    <TokenPaper data={o._userToken} balance={o.totalBalance} />
                  </Link>
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </RwdLayout>

      <Space h={100} />

      <RwdModal
        opened={opened}
        onClose={close}
        title={
          <Text fz="xl" fw={500}>
            Social account
          </Text>
        }
        sizes={{ mobile: 240, tablet: 'sm' }}
      >
        <Stack py="sm" className={classes.modal}>
          {x?.username ? (
            <a target="_blank" href={`https://x.com/${x.username}`} rel="noopener noreferrer">
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <FaXTwitter size={20} />
                  <Text>{x.username}</Text>
                </Group>
                <PiArrowSquareOut size={16} />
              </Group>
            </a>
          ) : null}

          {link?.startsWith('http') ? (
            <a target="_blank" href={link} rel="noopener noreferrer">
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <PiGlobe size={20} />
                  <Text>{link}</Text>
                </Group>
                <PiArrowSquareOut size={16} />
              </Group>
            </a>
          ) : null}
        </Stack>
      </RwdModal>
    </>
  )
}
