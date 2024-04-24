import { Box } from '@mantine/core'
import type { BlockDecoratorProps } from 'sanity'

export default function FullWidth({ children }: BlockDecoratorProps) {
  return (
    <Box pos="relative" component="span">
      <Box style={{ visibility: 'hidden', pointerEvents: 'none' }}>{children}</Box>
      <Box
        className="absolute-horizontal"
        style={{
          top: 0,
          width: 'calc(100% + 64px)',
        }}
      >
        <span>{children}</span>
      </Box>
    </Box>
  )
}
