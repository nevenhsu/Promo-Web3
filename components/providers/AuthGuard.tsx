'use client'

import useForceAuth from '@/hooks/useForceAuth'
import Image from 'next/image'
import { Box, Button, Space } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, open } = useForceAuth()

  return (
    <>
      {authenticated ? (
        <>{children}</>
      ) : (
        <Box pos="relative">
          <RwdLayout>
            <Image
              src="/images/welcome-login.png"
              width={1024}
              height={1024}
              alt=""
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 48,
              }}
            />

            <Space h={40} />

            <Button w="100%" size="md" onClick={open}>
              Login
            </Button>
          </RwdLayout>

          <Space h={100} />
        </Box>
      )}
    </>
  )
}
