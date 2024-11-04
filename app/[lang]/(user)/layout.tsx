import { Box } from '@mantine/core'
import AuthGuard from '@/components/providers/AuthGuard'

export default function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  return (
    <>
      <AuthGuard>
        <Box w={{ base: '100%', sm: '80%', lg: '60%' }} maw={600} mx="auto">
          {children}
        </Box>
      </AuthGuard>
    </>
  )
}
