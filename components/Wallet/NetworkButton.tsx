'use client'

import { useContractContext } from '@/wallet/ContractContext'
import { Menu, Button, Text } from '@mantine/core'
import { getNetworkName } from '@/wallet/utils/network'
import { supportedChains } from '@/wallet/variables'

export default function NetworkButton() {
  const { chainId, switchChain } = useContractContext()

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="outline" size="xs" color="white">
          {getNetworkName(chainId)}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {supportedChains.map(({ id, name }) => (
          <Menu.Item key={id} onClick={() => switchChain(id)}>
            <Text>{name}</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
