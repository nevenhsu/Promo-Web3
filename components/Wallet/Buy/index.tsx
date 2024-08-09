'use client'

import { useRouter } from '@/navigation'
import { Title, Stack, Center, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import LoadingLogo from '@/components/LoadingLogo'

export default function WalletBuy() {
  const router = useRouter()

  return (
    <>
      <RwdLayout>
        <Center h="50dvh">
          <Stack gap="lg" align="center">
            <LoadingLogo mb="lg" />

            <Title order={3}>Coming Soon</Title>

            <Button variant="outline" color="dark" onClick={() => router.back()}>
              Back
            </Button>
          </Stack>
        </Center>
      </RwdLayout>
    </>
  )
}
