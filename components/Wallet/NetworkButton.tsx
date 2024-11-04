'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useWeb3 } from '@/wallet/Web3Context'
import { Menu, Group, Button, Text } from '@mantine/core'
import { getNetwork } from '@/wallet/utils/network'
import { supportedChains } from '@/wallet/variables'

export default function NetworkButton() {
  const [opened, setOpened] = useState(false)

  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  const { chainId, switchChain } = useWeb3()
  const network = getNetwork(chainId)

  if (!chainId) return null

  return (
    <Menu
      shadow="md"
      width={200}
      opened={opened}
      onChange={opened => {
        setOpened(isAdmin ? opened : false)
      }}
    >
      <Menu.Target>
        <Button
          pl={6}
          variant="white"
          size="sm"
          color="dark"
          style={{
            boxShadow: 'var(--mantine-shadow-xs)',
          }}
          leftSection={<Image src={network.icon} alt={network.name} width={24} height={24} />}
        >
          {network.name}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {supportedChains.map(({ id, name }) => (
          <Menu.Item key={id} onClick={() => switchChain(id)}>
            <Group gap="xs">
              <Image src={getNetwork(id).icon} alt={network.name} width={24} height={24} />
              <Text>{name}</Text>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
