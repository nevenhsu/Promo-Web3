'use client'

import { useDisclosure } from '@mantine/hooks'
import { useAppSelector } from '@/hooks/redux'
import { Space, Group, Stack, Box, AspectRatio, Avatar, Text, Tabs } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import RwdModal from '@/components/share/RwdModal'
import { PiCrownSimple, PiHandHeart, PiRocket, PiGlobe, PiArrowSquareOut } from 'react-icons/pi'
import { FaXTwitter, FaInstagram } from 'react-icons/fa6'
import { LinkAccountPlatform } from '@/types/db'
import type { TUser } from '@/models/user'
import classes from './index.module.css'

enum Tab {
  Ranking = 'ranking',
  Activity = 'activity',
  Donate = 'donate',
}

export default function UserProfile({ data }: { data: TUser }) {
  const [opened, { open, close }] = useDisclosure(false)
  const { fetched, data: userState } = useAppSelector(state => state.user)

  const { name, username, details, linkedAccounts } = data
  const { bio, cover, avatar, link } = details || {}
  const isSelf = fetched && userState?._id === data._id

  // Get linked accounts
  const x = linkedAccounts?.find(account => account.platform === LinkAccountPlatform.X)
  const instagram = linkedAccounts?.find(
    account => account.platform === LinkAccountPlatform.Instagram
  )

  return (
    <>
      <AspectRatio ratio={4 / 1}>
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
          <Box pos="relative" top={-32}>
            <Avatar src={avatar} name={name || username} color="initials" size={64} />
          </Box>
        </Box>

        <Stack mb="lg">
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
              {instagram ? <FaInstagram size={20} /> : null}
              {link ? <PiGlobe size={20} /> : null}
            </Group>
          </Group>

          <Text fz="sm" c="dimmed">
            {bio}
          </Text>
        </Stack>

        <Tabs defaultValue={Tab.Ranking}>
          <Tabs.List grow>
            <Tabs.Tab value={Tab.Ranking} leftSection={<PiCrownSimple size={16} />}>
              Ranking
            </Tabs.Tab>
            <Tabs.Tab value={Tab.Activity} leftSection={<PiRocket size={16} />}>
              Activity
            </Tabs.Tab>
            <Tabs.Tab value={Tab.Donate} leftSection={<PiHandHeart size={16} />}>
              Donate
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </RwdLayout>

      <Space h={100} />

      <RwdModal
        opened={opened}
        onClose={close}
        title="Social account"
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
          {instagram?.username ? (
            <a
              target="_blank"
              href={`https://www.instagram.com/${instagram.username}/`}
              rel="noopener noreferrer"
            >
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <FaInstagram size={20} />
                  <Text>{instagram.username}</Text>
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
