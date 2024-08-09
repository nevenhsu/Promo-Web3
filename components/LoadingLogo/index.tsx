'use client'

import { Box, type BoxProps } from '@mantine/core'
import Logo from '@/public/logo.svg'
import classes from './index.module.css'

export default function LoadingLogo(props: { size?: number } & BoxProps) {
  const { size = 96, ...rest } = props

  return (
    <>
      <Box w={size} h={size} {...rest} className={classes.rotating}>
        <Logo width="100%" height="100%" />
      </Box>
    </>
  )
}
