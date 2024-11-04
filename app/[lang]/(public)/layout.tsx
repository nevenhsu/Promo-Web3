import { Box } from '@mantine/core'

export default function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  return (
    <>
      <Box w={{ base: '100%', sm: '80%', lg: '60%' }} maw={600} mx="auto">
        {children}
      </Box>
    </>
  )
}
