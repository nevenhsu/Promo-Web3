'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'
import { Box, Stack, Text, Title, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import classes from './index.module.css'

export default function CreateWallet() {
  const { ready, authenticated, user, createWallet } = usePrivy()

  const [loading, setLoading] = useState(false)

  const handleCreate = () => {
    if (user?.wallet) return

    setLoading(true)
    createWallet()
  }

  return (
    <Box pos="relative">
      <Box className={classes.bg}>
        <Image src="/images/welcome-wallet.png" width={1024} height={1024} alt="" />
      </Box>
      <RwdLayout className={classes.content}>
        <Stack>
          <Title>Create Wallet</Title>
          <Text fz="sm" c="dimmed" mb="md">
            Get a smart wallet with advanced features
          </Text>

          <Button
            size="md"
            disabled={!(ready && authenticated)}
            onClick={handleCreate}
            loading={loading}
          >
            Create a wallet
          </Button>
        </Stack>
      </RwdLayout>
    </Box>
  )
}
