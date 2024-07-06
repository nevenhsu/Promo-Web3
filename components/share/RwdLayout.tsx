import { Box, type BoxProps } from '@mantine/core'

export default function RwdLayout({
  children,
  ...rest
}: { children?: React.ReactNode } & BoxProps) {
  return (
    <Box px={{ base: 16 }} py={{ base: 16 }} {...rest}>
      {children}
    </Box>
  )
}
