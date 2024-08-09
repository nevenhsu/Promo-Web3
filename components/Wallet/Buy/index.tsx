'use client'

import { Title, Stack, Center, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import LoadingLogo from '@/components/LoadingLogo'
import { useGoBack } from '@/hooks/useGoBack'

export default function WalletBuy() {
  const { canGoBack, goBack } = useGoBack()

  return (
    <>
      <RwdLayout>
        <Center h="50dvh">
          <Stack gap="lg" align="center">
            <LoadingLogo mb="lg" />

            <Title order={3}>Coming Soon</Title>

            {canGoBack ? (
              <Button variant="outline" color="dark" onClick={() => goBack()}>
                Back
              </Button>
            ) : null}
          </Stack>
        </Center>
      </RwdLayout>
    </>
  )
}
