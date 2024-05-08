import { Paper, Stack, Group } from '@mantine/core'
import TitleBar from '@/components/TitleBar'
import LinkButton from '@/components/LinkButton'
import { IoPerson, IoWallet, IoLink, IoShield, IoNotifications } from 'react-icons/io5'
import { RiVipDiamondFill } from 'react-icons/ri'

export default function Setting() {
  return (
    <>
      <TitleBar title="Setting" />
      <Paper py={16}>
        <Stack>
          <LinkButton href="/setting/profile">
            <Group gap="xs">
              <IoPerson size={16} />
              Profile
            </Group>
          </LinkButton>
          <LinkButton href="/setting/kol">
            <Group gap="xs">
              <RiVipDiamondFill size={16} />
              KOL
            </Group>
          </LinkButton>
          <LinkButton href="/setting/wallet">
            <Group gap="xs">
              <IoWallet size={16} />
              Wallet
            </Group>
          </LinkButton>
          <LinkButton href="/setting/link-account">
            <Group gap="xs">
              <IoLink size={16} />
              Linked Account
            </Group>
          </LinkButton>
          <LinkButton href="/setting/privacy">
            <Group gap="xs">
              <IoShield size={16} />
              Privacy
            </Group>
          </LinkButton>
          <LinkButton href="/setting/notification">
            <Group gap="xs">
              <IoNotifications size={16} />
              Notification
            </Group>
          </LinkButton>
        </Stack>
      </Paper>
    </>
  )
}
