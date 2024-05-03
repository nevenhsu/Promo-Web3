import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useAppSelector } from '@/hooks/redux'
import { Group, Box, Button, Space } from '@mantine/core'
import { Avatar, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import useLogin from '@/hooks/useLogin'
import { useLogout } from '@privy-io/react-auth'
import { HiOutlineLogout } from 'react-icons/hi'
import { AiOutlineSetting } from 'react-icons/ai'

export default function Header() {
  const router = useRouter()

  const { login, authenticated } = useLogin()
  const { logout: logoutAll } = useLogout({
    onSuccess: () => {
      signOut()
    },
  })

  const { _id, data } = useAppSelector(state => state.user)
  const avatar = data.details?.avatar || ''
  // const authenticated = Boolean(_id)

  const openModal = () =>
    modals.openConfirmModal({
      title: 'See you next time',
      children: <Space h="xl" />,
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      onConfirm: logoutAll,
    })

  return (
    <>
      <Group h="100%" px={24} gap="xs" justify="space-between">
        <Box className="c-pointer" pos="relative" top={6} onClick={() => router.push('/')}></Box>

        <Group>
          {authenticated ? (
            <Menu position="bottom-end" width={120}>
              <Menu.Target>
                <Avatar className="c-pointer" src={avatar} />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => router.push('/setting')}
                  leftSection={<AiOutlineSetting />}
                >
                  Setting
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={openModal} leftSection={<HiOutlineLogout />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button onClick={login}>Login</Button>
          )}
        </Group>
      </Group>
    </>
  )
}
