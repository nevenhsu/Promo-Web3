'use client'

import Image from 'next/image'
import { useWeb3 } from '@/wallet/Web3Context'
import { Menu, Group, Button, Text } from '@mantine/core'
import { getNetwork } from '@/wallet/utils/network'
import { supportedChains } from '@/wallet/variables'

export default function NetworkButton() {
  const { chainId, switchChain } = useWeb3()
  const network = getNetwork(chainId)

  return (
    <Menu shadow="md" width={200}>
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
