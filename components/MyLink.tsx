'use client'

import { useRouter } from 'next/navigation'
import { Box, type BoxProps } from '@mantine/core'

type MyLinkProps = { children: React.ReactNode } & BoxProps & {
    href?: string
  }

export function MyLink({ children, href, ...rest }: MyLinkProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!href) return

    if (href.startsWith('/')) {
      router.push(href)
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Box className="c-pointer" component="span" onClick={handleClick} {...rest}>
      {children}
    </Box>
  )
}
