import { Box, type BoxProps } from '@mantine/core'

export default function RwdLayout({ children, ...rest }: { children: React.ReactNode } & BoxProps) {
  return (
    <Box px={{ base: 24 }} py={{ base: 40 }} {...rest}>
      {children}
    </Box>
  )
}
