'use client'

import { useEffect } from 'react'
import { Stack, Box, Title, Text, Button } from '@mantine/core'
import useContracts from '@/hooks/useContracts'

export default function Home() {
  const contracts = useContracts()

  const testContract = async () => {
    if (contracts) {
      contracts.token.name().then(console.log)
    }
  }

  useEffect(() => {
    testContract()
  }, [contracts])

  return (
    <>
      <Stack>
        <Title>Join to earn 8% bonus</Title>
        <Text>A new payment way to make triple wins for business based on the unique referral system.</Text>
        <Box>
          <Button>Get Started</Button>
        </Box>
      </Stack>
    </>
  )
}
